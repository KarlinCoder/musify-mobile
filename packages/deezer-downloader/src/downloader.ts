import { Buffer } from "buffer";
import { CryptoDigestAlgorithm, digestStringAsync } from "expo-crypto";
import {
	Directory,
	File,
	FileMode,
	Paths,
	type FileHandle,
} from "expo-file-system";
import { Album, Asset, requestPermissionsAsync } from "expo-media-library";
import { http, proxyUrl, UA_DESKTOP, UA_MOBILE } from "./http";
import { applyTags } from "./tagger";

const Blowfish = require("./blowfish.cjs");

const GW = "https://www.deezer.com/ajax/gw-light.php";
const MEDIA = "https://media.deezer.com/v1/get_url";

/** Nombre de la carpeta pública donde se guarda el audio: Music/musify. */
const ALBUM_NAME = "musify";

const FORMAT_NAME: Record<number, string> = { 1: "MP3_128", 3: "MP3_320", 9: "FLAC" };
const FORMAT_SIZE: Record<number, string> = {
	1: "FILESIZE_MP3_128",
	3: "FILESIZE_MP3_320",
	9: "FILESIZE_FLAC",
};

/** Deezer cifra el audio en bloques de 2048 bytes: 1 de cada 3 va cifrado. */
const BLOCK_BYTES = 2048;
const STRIPE_BYTES = 6144;
/** Lectura por pasada al descifrar (~384 KB, múltiplo del stripe). */
const READ_BYTES = STRIPE_BYTES * 64;
/** Porcentaje del progreso que corresponde a la descarga (el resto, descifrado). */
const DOWNLOAD_WEIGHT = 75;

export interface Progress {
	percent: number;
	downloaded: number;
	total: number;
}

export interface DownloadOptions {
	arl: string;
	format?: 1 | 3 | 9;
	onProgress?: (progress: Progress) => void;
	signal?: AbortSignal;
}

export interface DownloadResult {
	id: string;
	title: string;
	artist: string;
	filePath: string;
}

/**
 * Host de CDN que sirvió el audio la última vez (en memoria, por sesión).
 * Suele ser estable por región/red, así que se prueba primero.
 */
let lastGoodHost: string | null = null;

/** Host de una URL de CDN para los logs (si no parsea, devuelve la URL tal cual). */
function sourceHost(url: string): string {
	try {
		return new URL(url).host;
	} catch {
		return url;
	}
}

function decrypt(block: Buffer, key: string): Buffer {
	const cipher = new Blowfish(key, Blowfish.MODE.CBC, Blowfish.PADDING.NULL);
	cipher.setIv(Buffer.from([0, 1, 2, 3, 4, 5, 6, 7]));
	return Buffer.from(cipher.decode(block, Blowfish.TYPE.UINT8_ARRAY));
}

async function blowfishKey(trackId: string | number): Promise<string> {
	const hash = await digestStringAsync(
		CryptoDigestAlgorithm.MD5,
		String(trackId),
	);
	const secret = "g4el58wc0zvf9na1";
	let key = "";
	for (let i = 0; i < 16; i++) {
		key += String.fromCharCode(
			hash.charCodeAt(i) ^ hash.charCodeAt(i + 16) ^ secret.charCodeAt(i),
		);
	}
	return key;
}

/**
 * Lee el archivo cifrado en bloques, descifra el stripe y escribe el audio.
 * El progreso continúa desde `DOWNLOAD_WEIGHT` hasta 100.
 */
function decryptToFile(
	source: FileHandle,
	destination: FileHandle,
	sourceSize: number,
	key: string,
	onProgress?: (progress: Progress) => void,
	signal?: AbortSignal,
): void {
	let pending: Buffer = Buffer.alloc(0);
	let processed = 0;
	let isStart = true;

	const fix = (chunk: Uint8Array) => {
		const view = Buffer.from(chunk);
		if (isStart && view[0] === 0 && view.subarray(4, 8).toString() !== "ftyp") {
			let i = 0;
			while (view[i] === 0) i++;
			isStart = false;
			return view.subarray(i);
		}
		isStart = false;
		return view;
	};

	for (;;) {
		if (signal?.aborted) throw new Error("Descarga cancelada");

		const raw = source.readBytes(READ_BYTES);
		if (!raw.length) break;

		processed += raw.length;

		const buffer = pending.length
			? Buffer.concat([pending, Buffer.from(raw)])
			: Buffer.from(raw);

		const parts: Buffer[] = [];
		let offset = 0;
		for (; buffer.length - offset >= STRIPE_BYTES; offset += STRIPE_BYTES) {
			parts.push(
				decrypt(Buffer.from(buffer.subarray(offset, offset + BLOCK_BYTES)), key),
				Buffer.from(buffer.subarray(offset + BLOCK_BYTES, offset + STRIPE_BYTES)),
			);
		}
		pending = Buffer.from(buffer.subarray(offset));

		if (parts.length) {
			destination.writeBytes(fix(Buffer.concat(parts)));
		}

		onProgress?.({
			percent:
				DOWNLOAD_WEIGHT +
				(processed / sourceSize) * (100 - DOWNLOAD_WEIGHT),
			downloaded: processed,
			total: sourceSize,
		});
	}

	if (pending.length) {
		const tail =
			pending.length >= BLOCK_BYTES
				? Buffer.concat([
						decrypt(Buffer.from(pending.subarray(0, BLOCK_BYTES)), key),
						pending.subarray(BLOCK_BYTES),
					])
				: pending;
		destination.writeBytes(fix(tail));
	}
}

/**
 * Publica el audio en la biblioteca de Android dentro de Music/musify.
 * Devuelve la URI final del asset (file:///storage/...).
 */
async function publishToMusicLibrary(uri: string): Promise<string> {
	await requestPermissionsAsync(true);

	const album = await Album.get(ALBUM_NAME);
	if (album) {
		const asset = await Asset.create(uri, album);
		return asset.getUri();
	}

	const asset = await Asset.create(uri);
	await Album.create(ALBUM_NAME, [asset], true);
	return asset.getUri();
}

export async function downloadTrack(
	trackId: string | number,
	opts: DownloadOptions,
): Promise<DownloadResult> {
	// Deezer exige las cookies que devuelve el login (sid, account_id, ...)
	const jar = new Map<string, string>([["arl", opts.arl]]);

	const request = async (config: any) => {
		const res = await http.request({
			...config,
			headers: {
				...config.headers,
				Cookie: [...jar].map(([k, v]) => `${k}=${v}`).join("; "),
			},
		});
		const cookies = res.headers["set-cookie"];
		const list: string[] = Array.isArray(cookies)
			? cookies
			: cookies
				? [String(cookies)]
				: [];
		for (const raw of list) {
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
	const call = async (args: unknown) =>
		(await gw("song.getData", apiToken, args)).data.results;
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
					{
						type: "FULL",
						formats: [{ cipher: "BF_CBC_STRIPE", format: FORMAT_NAME[format] }],
					},
				],
				track_tokens: [track.TRACK_TOKEN],
			},
		})
	).data;
	if (!media.data) throw new Error(`get_url: ${JSON.stringify(media).slice(0, 200)}`);

	// 4. archivo de trabajo (se publica luego en Music/musify)
	const dir = new Directory(Paths.document, "music");
	dir.create({ intermediates: true, idempotent: true });

	// MediaStore detecta el MIME por la extensión con MimeTypeMap.getFileExtensionFromUrl(),
	// que falla si el nombre lleva caracteres fuera de [a-zA-Z0-9 ._()-] (p. ej. la coma).
	// Sin MIME la publicación revienta ("Primary directory DCIM not allowed") y el archivo
	// quedaría en la carpeta privada. Los acentos van codificados (%XX) y no dan problema.
	const baseName = `${track.ART_NAME} - ${track.SNG_TITLE}`
		.replace(/[!"#$%&'*+,\/:;<=>?@\[\\\]\^`{|}~]+/g, " ")
		.replace(/\s+/g, " ")
		.trim();
	const fileName =
		(baseName || `track-${track.SNG_ID}`) +
		(format === 9 ? ".flac" : ".mp3");
	const outFile = new File(dir, fileName);

	// Deezer devuelve varias CDNs y algunas estan caidas (403 sin cuerpo).
	// Si un host sirvió antes, se prueba primero (sort estable: el resto conserva el orden).
	const audioKey = await blowfishKey(track.SNG_ID);
	const sources = [...media.data[0].media[0].sources].sort((a, b) => {
		const aRank = sourceHost(a.url) === lastGoodHost ? 0 : 1;
		const bRank = sourceHost(b.url) === lastGoodHost ? 0 : 1;
		return aRank - bRank;
	});
	const failures: string[] = [];

	for (const [index, source] of sources.entries()) {
		const temp = new File(
			Paths.cache,
			`deezer-${track.SNG_ID}-${Date.now()}.enc`,
		);

		try {
			if (opts.signal?.aborted) throw new Error("Descarga cancelada");

			let downloadTotal = 0;
			const task = File.createDownloadTask(proxyUrl(source.url), temp, {
				headers: {
					"User-Agent": /\/mobile\//.test(source.url) ? UA_MOBILE : UA_DESKTOP,
				},
				onProgress: ({ bytesWritten, totalBytes }) => {
					if (totalBytes > 0) downloadTotal = totalBytes;
					opts.onProgress?.({
						percent:
							totalBytes > 0 ? (bytesWritten / totalBytes) * DOWNLOAD_WEIGHT : 0,
						downloaded: bytesWritten,
						total: totalBytes > 0 ? totalBytes : 0,
					});
				},
				signal: opts.signal,
			});

			await task.downloadAsync();

			const size = temp.size;
			if (!size)
				throw new Error("La CDN devolvió un archivo vacío (0 bytes)");

			if (sourceHost(source.url) !== lastGoodHost) {
				lastGoodHost = sourceHost(source.url);
				console.log(`✅ Host de CDN guardado: ${lastGoodHost}`);
			}

			outFile.create({ overwrite: true });
			const sourceHandle = temp.open(FileMode.ReadOnly);
			const destinationHandle = outFile.open(FileMode.WriteOnly);

			try {
				decryptToFile(
					sourceHandle,
					destinationHandle,
					size,
					audioKey,
					opts.onProgress,
					opts.signal,
				);
			} finally {
				sourceHandle.close();
				destinationHandle.close();
			}

			// El FLAC no lleva ID3; para MP3 se escriben los tags antes de publicar
			if (format !== 9) {
				try {
					await applyTags(outFile, track.SNG_ID, { signal: opts.signal });
				} catch (error) {
					if (opts.signal?.aborted) throw new Error("Descarga cancelada");
					console.warn("⚠️ No se pudieron escribir los tags ID3:", error);
				}
			}

			const outputSize = outFile.size;
			let filePath = outFile.uri;
			try {
				filePath = await publishToMusicLibrary(outFile.uri);
				if (outFile.exists) outFile.delete();
			} catch (error) {
				console.warn("⚠️ No se pudo publicar en Music/musify:", error);
			}

			opts.onProgress?.({
				percent: 100,
				downloaded: outputSize,
				total: outputSize,
			});

			return {
				id: track.SNG_ID,
				title: track.SNG_TITLE,
				artist: track.ART_NAME,
				filePath,
			};
		} catch (error) {
			if (opts.signal?.aborted) throw new Error("Descarga cancelada");

			const message = error instanceof Error ? error.message : String(error);
			const host = sourceHost(source.url);
			console.warn(
				`⚠️ CDN ${index + 1}/${sources.length} falló (${host}): ${message}`,
			);
			failures.push(`${host}: ${message}`);

			// CDN caída o fallo parcial: limpiar y probar la siguiente
		} finally {
			try {
				if (temp.exists) temp.delete();
			} catch {}
		}
	}

	try {
		if (outFile.exists) outFile.delete();
	} catch {}

	const reason = failures.length ? ` (${failures.join(" | ")})` : "";
	const error = new Error(
		`Ninguna CDN sirvió el audio de ${track.SNG_TITLE}${reason}`,
	);
	console.error("❌ Descarga fallida:", error.message);
	throw error;
}

export default downloadTrack;
