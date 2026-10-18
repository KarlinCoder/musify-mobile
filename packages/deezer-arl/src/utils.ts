import { getRandomBytes } from "expo-crypto";

export const logMessage = (message: string) => console.error(`[*] ${message}`);

export const hex = (bytes: number) =>
  Array.from(getRandomBytes(bytes), (b) => b.toString(16).padStart(2, "0")).join("");
