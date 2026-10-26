import axios from "axios";

const PROXY_URL = "https://musify-proxy.api.karlincoder.com";

const UA_DESKTOP =
	"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36";
const UA_MOBILE =
	"Mozilla/5.0 (Linux; Android 8.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Mobile Safari/537.36";

export { UA_DESKTOP, UA_MOBILE };

/** Envuelve una URL en el proxy dejando el destino en `?url=`. */
export function proxyUrl(raw: string): string {
	return `${PROXY_URL}/?url=${encodeURIComponent(raw)}`;
}

export const http = axios.create({
	headers: {
		"User-Agent": UA_DESKTOP,
		Referer: "https://www.deezer.com/",
		Origin: "https://www.deezer.com",
	},
	validateStatus: () => true,
});

http.interceptors.request.use((config) => {
	if (config.url && /^https?:\/\//.test(config.url)) {
		const target = new URL(config.url);
		if (config.params) {
			for (const [key, value] of Object.entries(config.params)) {
				if (value != null) target.searchParams.set(key, String(value));
			}
			config.params = undefined;
		}
		config.url = proxyUrl(target.toString());
	}
	return config;
});
