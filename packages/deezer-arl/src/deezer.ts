import type { AxiosInstance, AxiosResponse } from "axios";
import {
  APP_NAME,
  APPLICATION_ID,
  AUTH_GATEAWAY_API,
  DEFAULT_LANGUAGE,
  DEFAULT_RECOMMENDATION_COUNTRY,
  GATEAWAY_API,
  ORIGIN_URL,
  WEB_ORIGIN,
} from "./constants";
import { DeezerError, NetworkError, ValidationError } from "./errors";
import { getTempEmail } from "./mail";
import { seedDeezerAccount } from "./seed";
import { hex, logMessage } from "./utils";

type CallOptions = {
  apiToken?: string;
  baseUrl?: string;
  origin?: string;
};

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

  const call = async (
    method: string,
    data: unknown,
    {
      apiToken = "",
      baseUrl = GATEAWAY_API,
      origin = ORIGIN_URL,
    }: CallOptions = {},
  ) => {
    const cid = Math.floor(Math.random() * 1e9);
    const url = `${baseUrl}?method=${encodeURIComponent(method)}&input=3&api_version=1.0&api_token=${encodeURIComponent(apiToken)}&cid=${cid}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Origin: origin,
      Referer: `${origin}/`,
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
      if (method === "deezer_userAutolog" && json.results?.checkform)
        return json.results;
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
  const emailInfo = await call(
    "deezer.emailCheck",
    { EMAIL: email },
    { apiToken: checkform },
  );
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
    { apiToken: checkform },
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
    { apiToken: checkform },
  );

  const arl = result.arl || jar.get("arl");
  if (!arl) throw new DeezerError("Cuenta creada pero sin ARL en la respuesta");

  jar.clear();
  jar.set("arl", arl);

  try {
    logMessage("Autenticando la sesion de Deezer...");
    const session = await call(
      "deezer.getUserData",
      {},
      {
        baseUrl: AUTH_GATEAWAY_API,
        origin: WEB_ORIGIN,
      },
    );
    if (!session?.USER?.USER_ID)
      throw new DeezerError("No se pudo autenticar la sesion con el ARL");
    const authToken = session.checkForm;
    if (!authToken)
      throw new DeezerError("No se recibio el token de la sesion autenticada");

    const sid = jar.get("sid");
    jar.clear();
    jar.set("arl", arl);
    if (sid) jar.set("sid", sid);

    try {
      const updated = await call(
        "user.updateRecommendationCountry",
        { RECOMMENDATION_COUNTRY: DEFAULT_RECOMMENDATION_COUNTRY },
        {
          apiToken: authToken,
          baseUrl: AUTH_GATEAWAY_API,
          origin: WEB_ORIGIN,
        },
      );
      if (updated !== true)
        throw new DeezerError("Deezer rechazo el cambio de pais de recomendacion");
      logMessage(
        `Pais de recomendacion configurado: ${DEFAULT_RECOMMENDATION_COUNTRY}`,
      );
    } catch (error) {
      logMessage(
        `No se pudo configurar el pais de recomendacion: ${error instanceof Error ? error.message : String(error)}`,
      );
    }

    try {
      const updated = await call(
        "user.update",
        { USER_DATA: {}, LANG: DEFAULT_LANGUAGE },
        {
          apiToken: authToken,
          baseUrl: AUTH_GATEAWAY_API,
          origin: WEB_ORIGIN,
        },
      );
      if (updated !== true)
        throw new DeezerError("Deezer rechazo el cambio de idioma");
      logMessage(`Idioma configurado: ${DEFAULT_LANGUAGE}`);
    } catch (error) {
      logMessage(
        `No se pudo configurar el idioma: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  } catch (error) {
    logMessage(
      `No se pudo configurar la sesion de Deezer: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  await seedDeezerAccount(http, arl);

  logMessage("Cuenta de Deezer creada correctamente.");
  return { ...result, arl };
};
