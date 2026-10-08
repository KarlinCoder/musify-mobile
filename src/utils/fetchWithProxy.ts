import { fetch as expoFetch } from "expo/fetch";

export type FetchWithProxyOptions = {
  /**
   * URL del proxy: http://127.0.0.1:8080, http://user:pass@127.0.0.1:8080,
   * https://proxy:3128 o https://user:pass@proxy:3128
   */
  proxyUrl?: string | URL;
};

function toBase64(str: string): string {
  if (typeof (globalThis as any).btoa === "function") {
    return (globalThis as any).btoa(str);
  }
  const buf = (globalThis as any).Buffer;
  if (buf) {
    return buf.from(str, "binary").toString("base64");
  }
  throw new Error(
    "No hay btoa/Buffer disponible para codificar credenciales del proxy",
  );
}

//

export async function fetchWithProxy(
  input: RequestInfo | URL,
  init?: RequestInit,
  options?: FetchWithProxyOptions,
): Promise<Response> {
  if (!options?.proxyUrl) {
    return expoFetch(input as any, init);
  }

  const proxyUrl =
    typeof options.proxyUrl === "string"
      ? new URL(options.proxyUrl)
      : options.proxyUrl;

  const targetUrl =
    typeof input === "string"
      ? new URL(input)
      : input instanceof URL
        ? input
        : new URL((input as Request).url);

  // Versión A: solo soportamos HTTP -> HTTP vía proxy http(s)
  if (targetUrl.protocol !== "http:") {
    throw new Error(
      "[fetchWithProxy vA] Solo se soporta destino HTTP cuando se usa proxy. Para HTTPS->túnel CONNECT se necesita un agente (vB).",
    );
  }

  if (proxyUrl.protocol !== "http:" && proxyUrl.protocol !== "https:") {
    throw new Error("[fetchWithProxy] El proxy debe ser http:// o https://");
  }

  const headers = new Headers(init?.headers ?? {});

  headers.set("Host", targetUrl.host);

  const hasCreds = proxyUrl.username || proxyUrl.password;
  if (hasCreds) {
    const user = decodeURIComponent(proxyUrl.username);
    const pass = proxyUrl.password ? decodeURIComponent(proxyUrl.password) : "";
    const token = toBase64(`${user}:${pass}`);
    headers.set("Proxy-Authorization", `Basic ${token}`);
  }

  const reqInit: RequestInit = {
    ...init,
    headers,
  };

  return expoFetch(targetUrl.toString(), reqInit);
}
