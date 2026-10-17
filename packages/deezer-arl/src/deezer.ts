import type { AxiosInstance, AxiosResponse } from "axios";
import {
  APP_NAME,
  APPLICATION_ID,
  GATEAWAY_API,
  ORIGIN_URL,
} from "./constants";
import { DeezerError, NetworkError, ValidationError } from "./errors";
import { getTempEmail } from "./mail";
import { hex, logMessage } from "./utils";

export const createDeezerAccount = async (http: AxiosInstance) => {
  const { address: email } = await getTempEmail(http);
  const password = `Ab1!${hex(6)}`;
  const username = `dz${hex(5)}`;
  const birthday = "1995-01-01";
  const sex = "M";
  const deviceToken = hex(32);
  const jar = new Map<string, string>();

  const storeCookies = (res: AxiosResponse) => {
    const raw = res.headers["set-cookie"];
    if (!raw) return;
    for (const cookie of raw) {
      const pair = cookie.split(";")[0];
      const i = pair.indexOf("=");
      if (i > 0) jar.set(pair.slice(0, i).trim(), pair.slice(i + 1).trim());
    }
  };

  const call = async (method: string, data: unknown, apiToken = "") => {
    const cid = Math.floor(Math.random() * 1e9);
    const url = `${GATEAWAY_API}?method=${encodeURIComponent(method)}&input=3&api_version=1.0&api_token=${encodeURIComponent(apiToken)}&cid=${cid}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Origin: ORIGIN_URL,
      Referer: `${ORIGIN_URL}/`,
    };
    if (jar.size)
      headers.Cookie = [...jar].map(([k, v]) => `${k}=${v}`).join("; ");

    let res: AxiosResponse;
    try {
      res = await http.post(url, data, { headers });
    } catch (cause) {
      throw new NetworkError(`Fallo de red al llamar a Deezer (${method})`, { cause });
    }
    storeCookies(res);

    const json = res.data;
    if (json?.error && Object.keys(json.error).length) {
      const [code, message] = Object.entries(json.error)[0];
      const text = typeof message === "string" ? message : code;
      if (text === "arl_expired" && json.results) return json.results;
      throw new DeezerError(`Deezer ${method}: ${text}`);
    }
    return json?.results || {};
  };

  logMessage("Conectando con Deezer (autolog)...");
  const { checkform } = await call("deezer_userAutolog", {
    APP_NAME,
    APPLICATION_ID,
    AUTHORIZE_UNLOGGED: true,
    CHECKFORM: true,
    DEVICE_TOKEN: deviceToken,
  });
  if (!checkform) throw new DeezerError("No se recibio checkform del autolog");

  logMessage(`Verificando disponibilidad del email (${email})...`);
  const emailInfo = await call("deezer.emailCheck", { EMAIL: email }, checkform);
  if (emailInfo?.availability === false)
    throw new ValidationError(`El email ${email} ya esta registrado en Deezer`);

  logMessage("Validando datos de registro en Deezer...");
  const constraints = await call(
    "user_checkRegisterConstraints",
    {
      APP_NAME,
      APPLICATION_ID,
      DEVICE_TOKEN: deviceToken,
      BIRTHDAY: birthday,
      EMAIL: email,
      PASSWORD: password,
      BLOG_NAME: username,
      SEX: sex,
    },
    checkform,
  );
  if (constraints.errors && Object.keys(constraints.errors).length)
    throw new ValidationError(
      `Registro rechazado: ${JSON.stringify(constraints.errors)}`,
    );

  logMessage("Creando cuenta de Deezer...");
  const result = await call(
    "user_create",
    {
      BLOG_NAME: username,
      APP_NAME,
      EMAIL: email,
      PASSWORD: password,
      SEX: sex,
      BIRTHDAY: birthday,
      APPLICATION_ID,
      DEVICE_TOKEN: deviceToken,
    },
    checkform,
  );

  const arl = result.arl || jar.get("arl");
  if (!arl) throw new DeezerError("Cuenta creada pero sin ARL en la respuesta");

  logMessage("Cuenta de Deezer creada correctamente.");
  return result;
};
