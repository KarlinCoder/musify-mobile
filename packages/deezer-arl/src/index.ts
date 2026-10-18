import axios from "axios";
import { PROXY_URL, USER_AGENT } from "./constants";
import { createDeezerAccount } from "./deezer";
import { DzArlError } from "./errors";

const http = axios.create({
  validateStatus: () => true,
  headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
});

http.interceptors.request.use((config) => {
  if (config.url && /^https?:\/\//.test(config.url)) {
    config.url = `${PROXY_URL}/?url=${encodeURIComponent(config.url)}`;
  }
  return config;
});

export const getDeezerTokens = async () => {
  try {
    return await createDeezerAccount(http);
  } catch (error) {
    if (error instanceof DzArlError) throw error;
    throw new DzArlError("Error inesperado al generar los tokens de Deezer", {
      cause: error,
    });
  }
};

export * from "./constants";
export * from "./errors";
