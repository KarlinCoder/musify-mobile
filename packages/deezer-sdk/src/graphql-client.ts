import { Buffer } from "buffer";
import type { AxiosInstance } from "axios";
import { createHttpClient } from "deezer-arl";

const AUTH_URL = "https://auth.deezer.com/login/arl?jo=p&rto=c&i=c";
const API_URL = "https://pipe.deezer.com/api";

function decodeExp(jwt: string): number | null {
  try {
    const payload = jwt.split(".")[1];
    if (!payload) return null;

    const claims: {
      userId: string;
      scopes: string[];
      exp: number;
      iat: number;
    } = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));

    return claims?.exp ?? null;
  } catch {
    return null;
  }
}

function maskJwt(jwt: string): string {
  if (jwt.length <= 24) return "***";

  return `${jwt.slice(0, 12)}...${jwt.slice(-6)} (${jwt.length} chars)`;
}

export interface DeezerClientOptions {
  showLogs?: boolean;
  proxy?: string;
}

export class DeezerClient {
  private jwt = "";
  private jwtExpiresAt: number | null = null;
  private authLock: Promise<void> = Promise.resolve();
  private http: AxiosInstance;

  private readonly refreshMarginSeconds = 30;
  private readonly logPayloads: boolean;

  /** Adaptador WHATWG fetch que usa el mismo http client (y proxy). */
  fetch: typeof fetch;

  constructor(
    private readonly arl: string,
    options: DeezerClientOptions = { showLogs: true },
  ) {
    if (!arl?.trim()) {
      throw new Error(
        "No se proporcionó ARL. Pasa la credencial como primer parámetro.",
      );
    }

    this.logPayloads = options.showLogs ?? false;
    this.http = createHttpClient(options.proxy);

    this.fetch = async (input, init) => {
      const url =
        typeof input === "string"
          ? input
          : input instanceof URL
            ? input.toString()
            : input.url;

      const headers: Record<string, string> = {};
      if (init?.headers) {
        new Headers(init.headers).forEach((value, key) => {
          headers[key] = value;
        });
      }

      const response = await this.http.request<string>({
        url,
        method: init?.method ?? "GET",
        headers,
        data: init?.body,
        responseType: "text",
      });

      const contentType = response.headers["content-type"];

      return new Response(response.data, {
        status: response.status,
        statusText: response.statusText,
        headers: {
          "Content-Type":
            typeof contentType === "string" ? contentType : "application/json",
        },
      });
    };
  }

  get jwtTtlSeconds(): number {
    if (!this.jwt || this.jwtExpiresAt === null) return 0;
    return Math.max(0, Math.floor(this.jwtExpiresAt - Date.now() / 1000));
  }

  private invalidateJwt(): void {
    this.jwt = "";
    this.jwtExpiresAt = null;
  }

  private hasValidJwt(): boolean {
    if (!this.jwt || this.jwtExpiresAt === null) return false;
    const now = Date.now() / 1000;
    return now < this.jwtExpiresAt - this.refreshMarginSeconds;
  }

  async getJwt(): Promise<string> {
    if (this.hasValidJwt()) {
      console.log(`🔑 JWT cacheado — quedan ${this.jwtTtlSeconds}s`);
      return this.jwt;
    }

    const currentLock = this.authLock;
    let releaseLock: () => void = () => {};
    this.authLock = new Promise((resolve) => {
      releaseLock = resolve;
    });

    try {
      await currentLock;

      if (this.hasValidJwt()) {
        console.log(`🔑 JWT cacheado — quedan ${this.jwtTtlSeconds}s`);
        return this.jwt;
      }

      const authStart = performance.now();
      const { data } = await this.http.post(AUTH_URL, null, {
        headers: {
          "Content-Type": "application/json",
          Cookie: `arl=${this.arl}`,
        },
      });

      if (!data?.jwt) throw new Error("Deezer Auth Error: No JWT received");

      this.jwt = data.jwt;
      this.jwtExpiresAt = decodeExp(this.jwt);

      const exp =
        this.jwtExpiresAt === null
          ? "sin `exp`, no se cachea (se pedirá uno por petición)"
          : `exp en ${this.jwtTtlSeconds}s`;

      console.log(
        `🔑 JWT obtenido en ${(performance.now() - authStart).toFixed(0)}ms — ` +
          `${maskJwt(this.jwt)}, ${exp}`,
      );

      return this.jwt;
    } catch (error) {
      // Un fallo de auth no debe dejar un token a medias cacheado.
      this.invalidateJwt();

      if (error instanceof Error) {
        throw new Error("Error obteniendo el JWT: " + error.message);
      }

      throw new Error("Error obteniendo el JWT: " + String(error));
    } finally {
      releaseLock();
    }
  }

  /**
   * Devuelve el header `Authorization` listo para usar, renovando el JWT si
   * hace falta (usa la caché y el refresh de `getJwt`).
   */
  async getAuthorizationHeader(): Promise<string> {
    return `Bearer ${await this.getJwt()}`;
  }

  async run(
    query: string,
    variables: Record<string, unknown> = {},
    isRetry = false,
  ): Promise<unknown> {
    const jwt = await this.getJwt();

    let response;
    try {
      response = await this.http.post(
        API_URL,
        { query, variables },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
          },
        },
      );
    } catch (error) {
      throw new Error(
        `Fallo enviando la query a pipe.deezer.com: ${error instanceof Error ? error.message : String(error)}`,
      );
    }

    const { data, status } = response;

    if (this.logPayloads) {
      console.log(JSON.stringify({ status, data }, null, 2));
    }

    // Deezer puede invalidar el token antes de su `exp`. En ese caso se
    // descarta, se renueva y se reintenta una unica vez.
    if ((status === 401 || status === 403) && !isRetry) {
      console.warn(
        `⚠️  ${API_URL} respondió ${status} — renovando JWT y reintentando`,
      );
      this.invalidateJwt();

      return this.run(query, variables, true);
    }

    return data;
  }
}

/**
 * Crea un cliente. El ARL es obligatoria y es la credencial de la sesión.
 * El proxy es opcional; si se pasa, todas las peticiones (auth y GraphQL) lo usan.
 *
 *   const client = createDeezerClient(process.env.DEEZER_ARL, { proxy });
 *   await client.run(print(getArtist), { artistId: "416239" });
 */
export function createDeezerClient(
  arl: string,
  options: DeezerClientOptions = {},
): DeezerClient {
  if (!arl?.trim()) {
    throw new Error("ARL no proporcionado. Pasa la credencial como parámetro.");
  }

  return new DeezerClient(arl.trim(), options);
}
