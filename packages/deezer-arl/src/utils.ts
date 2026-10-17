import { randomBytes } from "node:crypto";

export const logMessage = (message: string) => console.error(`[*] ${message}`);

export const hex = (bytes: number) => randomBytes(bytes).toString("hex");
