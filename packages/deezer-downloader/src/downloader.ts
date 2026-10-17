import fs from "fs";
import path from "path";
import { createHash } from "crypto";
import { pipeline } from "stream/promises";
import https from "https";
import axios from "axios";

const Blowfish = require("./blowfish.cjs");

const GW = "https://www.deezer.com/ajax/gw-light.php";
const MEDIA = "https://media.deezer.com/v1/get_url";

const UA_DESKTOP =
	"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36";
const UA_MOBILE =
	"Mozilla/5.0 (Linux; Android 8.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Mobile Safari/537.36";

const FORMAT_NAME: Record<number, string> = { 1: "MP3_128", 3: "MP3_320", 9: "FLAC" };
const FORMAT_SIZE: Record<number, string> = {
	1: "FILESIZE_MP3_128",
	3: "FILESIZE_MP3_320",
	9: "FILESIZE_FLAC",
};

function proxyConfig(raw?: string) {
	if (!raw || /^(none|off|direct)$/i.test(raw)) return false;
	const url = new URL(raw.includes("://") ? raw : `http://${raw}`);
	return {
		protocol: url.protocol.replace(":", ""),
		host: url.hostname,
		port: Number(url.port),
		auth: { username: url.username, password: url.password },
	};
}

const http = axios.create({
	httpsAgent: new https.Agent({ rejectUnauthorized: false }),
	headers: {
		"User-Agent": UA_DESKTOP,
		Referer: "https://www.deezer.com/",
		Origin: "https://www.deezer.com",
	},
	validateStatus: () => true,
});

export interface Progress {
	percent: number;
	downloaded: number;
	total: number;
}

export interface DownloadOptions {
	arl: string;
	proxy?: string;
	outputDir?: string;
	format?: 1 | 3 | 9;
	onProgress?: (progress: Progress) => void;
}

/** Deezer cifra el audio en bloques de 2048 bytes: 1 de cada 3 va cifrado. */
function decrypt(block: Buffer, key: string): Buffer {
	const cipher = new Blowfish(key, Blowfish.MODE.CBC, Blowfish.PADDING.NULL);
	cipher.setIv(Buffer.from([0, 1, 2, 3, 4, 5, 6, 7]));
	return Buffer.from(cipher.decode(block, Blowfish.TYPE.UINT8_ARRAY));
}

function blowfishKey(trackId: string | number): string {
	const hash = createHash("md5").update(String(trackId)).digest("hex");
	const secret = "g4el58wc0zvf9na1";
	let key = "";
	for (let i = 0; i < 16; i++) {
		key += String.fromCharCode(
			hash.charCodeAt(i) ^ hash.charCodeAt(i + 16) ^ secret.charCodeAt(i),
		);
	}
	return key;
}

async function* toAudio(
	source: AsyncIterable<Buffer>,
	key: string,
	total: number,
	onProgress?: (progress: Progress) => void,
) {
	let pending: Buffer = Buffer.alloc(0);
	let downloaded = 0;
	let isStart = true;

	const fix = (chunk: Buffer) => {
		if (isStart && chunk[0] === 0 && chunk.subarray(4, 8).toString() !== "ftyp") {
			let i = 0;
			while (chunk[i] === 0) i++;
			isStart = false;
			return chunk.subarray(i);
		}
		isStart = false;
		return chunk;
	};

	for await (const raw of source) {
		downloaded += raw.length;
		onProgress?.({
			percent: Math.min(100, (downloaded / total) * 100),
			downloaded,
			total,
		});

		const buffer = pending.length ? Buffer.concat([pending, raw]) : raw;
		const parts: Buffer[] = [];
		let offset = 0;
		for (; buffer.length - offset >= 6144; offset += 6144) {
			parts.push(
				decrypt(buffer.subarray(offset, offset + 2048), key),
				buffer.subarray(offset + 2048, offset + 6144),
			);
		}
		pending = buffer.subarray(offset);

		if (parts.length) yield fix(Buffer.concat(parts));
	}

	if (pending.length) {
		const tail =
			pending.length >= 2048
				? Buffer.concat([
						decrypt(pending.subarray(0, 2048), key),
						pending.subarray(2048),
					])
				: pending;
		yield fix(tail);
	}
}

export async function downloadTrack(trackId: string | number, opts: DownloadOptions) {
	// Deezer exige las cookies que devuelve el login (sid, account_id, ...)
	const jar = new Map<string, string>([["arl", opts.arl]]);

	const request = async (config: any) => {
		const res = await http.request({
			...config,
			proxy: proxyConfig(opts.proxy ?? process.env.DEEZER_PROXY) as any,
			headers: { ...config.headers, Cookie: [...jar].map(([k, v]) => `${k}=${v}`).join("; ") },
		});
		for (const raw of [].concat(res.headers["set-cookie"] ?? [])) {
			const [pair] = raw.split(";");
			const i = pair.indexOf("=");
			if (i > 0) jar.set(pair.slice(0, i).trim(), pair.slice(i + 1).trim());
		}
		return res;
	};

	const gw = (method: string, apiToken: string, args: unknown) =>
		request({
			url: GW,
			method: "POST",
			data: args,
			params: { api_version: "1.0", api_token: apiToken, input: "3", method },
		});

	// 1. sesión
	const session = (await gw("deezer.getUserData", "null", {})).data;
	const apiToken = session.results.checkForm;
	const licenseToken = session.results.USER.OPTIONS.license_token;

	// 2. metadata
	const call = async (args: unknown) => (await gw("song.getData", apiToken, args)).data.results;
	let track = await call({ SNG_ID: trackId });
	if (!track.MD5_ORIGIN && track.FALLBACK?.SNG_ID) {
		track = await call({ SNG_ID: track.FALLBACK.SNG_ID });
	}

	// 3. formato + urls de stream
	const wanted = opts.format ?? 3;
	const format = Number(track[FORMAT_SIZE[wanted]]) ? wanted : 1;
	const media = (
		await request({
			url: MEDIA,
			method: "POST",
			data: {
				license_token: licenseToken,
				media: [
					{ type: "FULL", formats: [{ cipher: "BF_CBC_STRIPE", format: FORMAT_NAME[format] }] },
				],
				track_tokens: [track.TRACK_TOKEN],
			},
		})
	).data;
	if (!media.data) throw new Error(`get_url: ${JSON.stringify(media).slice(0, 200)}`);

	// 4. download
	const dir = opts.outputDir ?? path.join(process.cwd(), "music");
	await fs.promises.mkdir(dir, { recursive: true });
	const filePath = path.join(
		dir,
		`${track.ART_NAME} - ${track.SNG_TITLE}`.replace(/[\\/:*?"<>|]+/g, "_") +
			(format === 9 ? ".flac" : ".mp3"),
	);

	// Deezer devuelve varias CDNs y algunas estan caidas (403 sin cuerpo)
	for (const source of media.data[0].media[0].sources) {
		const res = await request({
			url: source.url,
			method: "GET",
			responseType: "stream",
			headers: { "User-Agent": /\/mobile\//.test(source.url) ? UA_MOBILE : UA_DESKTOP },
		});
		const total = Number(res.headers["content-length"] ?? 0);
		if (res.status !== 200 || !total) {
			res.data.resume();
			continue;
		}

		// el stream viene cifrado (BF_CBC_STRIPE) y se descifra mientras se escribe
		await pipeline(
			res.data as any,
			toAudio(res.data, blowfishKey(track.SNG_ID), total, opts.onProgress) as any,
			fs.createWriteStream(filePath),
		);

		return { id: track.SNG_ID, title: track.SNG_TITLE, artist: track.ART_NAME, filePath };
	}

	throw new Error(`Ninguna CDN sirvio el audio de ${track.SNG_TITLE}`);
}

export default downloadTrack;
