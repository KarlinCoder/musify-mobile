import { PROXY } from "./constants";
import { createDeezerAccount } from "./deezer";
import { DzArlError } from "./errors";
import { createHttpClient } from "./proxy";

const http = createHttpClient(PROXY);

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
export * from "./proxy";
