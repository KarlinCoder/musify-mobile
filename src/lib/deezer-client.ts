import { Buffer } from "buffer";
import axios from "axios";

const AUTH_URL = "https://auth.deezer.com/login/arl?jo=p&rto=c&i=c";
const API_URL = "https://pipe.deezer.com/api";

const ARL =
  process.env.DEEZER_ARL ??
  "2dd9cd96d9272cd665d73dcae22d9da7540bdd1df335926e3110bb75542dafc90fa6c553af53b01085fbcd583a4e5d2e6ee8589b871bd93db1b2f8c2d8167ec99c4a9e80b29bcb34b6985aabbd06966014049ae4ba95f83d8e2a9db8de89650e";

const PROXY = {
  protocol: "http",
  host: "31.59.20.176",
  port: 6754,
  auth: {
    username: "ympyzbfs",
    password: "mqw3jdcuuzvw",
  },
};

export class DeezerClient {
  private jwt = "";
  private jwtExpiresAt = 0;
  private readonly refreshMarginSeconds = 30;
  private authLock: Promise<void> = Promise.resolve();

  constructor(private readonly arl = ARL) {
    if (!arl) throw new Error("No se encontró ARL (variable DEEZER_ARL)");
  }

  private async getJwt(): Promise<string | null> {
    const now = Date.now() / 1000;
    if (this.jwt && now < this.jwtExpiresAt - this.refreshMarginSeconds) {
      return this.jwt;
    }

    const currentLock = this.authLock;
    let releaseLock: () => void;
    this.authLock = new Promise((resolve) => {
      releaseLock = resolve;
    });

    try {
      await currentLock;

      const nowAfterLock = Date.now() / 1000;
      if (
        this.jwt &&
        nowAfterLock < this.jwtExpiresAt - this.refreshMarginSeconds
      ) {
        return this.jwt;
      }

      //   const { data } = await axios.post(AUTH_URL, null, {
      //     headers: {
      //       "Content-Type": "application/json",
      //       Cookie: `arl=${this.arl}`,
      //     },
      //     withCredentials: true,
      //     proxy: PROXY,
      //   });

      const res = await fetch(AUTH_URL, {
        method: "POST",
        credentials: "omit",
        headers: {
          "Content-Type": "application/json",
          Cookie: `arl=${this.arl}`,
        },
      });

      const data = await res.json();

      console.log(data);

      if (!data.jwt) throw new Error("Deezer Auth Error: No JWT received");

      this.jwt = data.jwt;
      this.jwtExpiresAt = JSON.parse(
        Buffer.from(data.jwt.split(".")[1], "base64").toString(),
      ).exp;

      return this.jwt;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Error obteniendo el JWT: " + error.message + "jwt");
      }
      return null;
    } finally {
      releaseLock!();
    }
  }

  async run(query: string, variables: Record<string, unknown> = {}) {
    const jwt = await this.getJwt();

    try {
      try {
        const { data, status } = await axios.post(
          `${API_URL}`,
          { query, variables },
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
              "Content-Type": "application/json",
            },
          },
        );

        alert(JSON.stringify({ status, data }, null, 2));
        console.log(JSON.stringify({ status, data }, null, 2));

        return data;
      } catch (error) {
        throw new Error(
          `Fallo enviando la query a pipe.deezer.com: "${error instanceof Error ? error.message : String(error)}"`,
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Algo fallo en ${API_URL}: Mensaje: ${error.message}`);
      }

      return null;
    }
  }
}

export function createDeezerClient(arl: string): DeezerClient {
  if (!arl) {
    throw new Error("ARL no proporcionado. Pasa el parámetro arl");
  }
  return new DeezerClient(arl);
}
