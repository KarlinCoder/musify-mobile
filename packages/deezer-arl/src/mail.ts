import type { AxiosInstance } from "axios";
import { MailTmError, NetworkError } from "./errors";
import { hex, logMessage } from "./utils";

const MAILTM = "https://api.mail.tm";

interface MailTmDomain {
  domain: string;
  isActive: boolean;
  isPrivate: boolean;
}

export const getTempEmail = async (http: AxiosInstance) => {
  let domains: MailTmDomain[];
  try {
    ({ data: domains } = await http.get<MailTmDomain[]>(`${MAILTM}/domains`));
  } catch (cause) {
    throw new NetworkError("No se pudieron obtener los dominios de mail.tm", { cause });
  }

  if (!domains?.length) throw new MailTmError("mail.tm no devolvio dominios");

  const { domain } = domains.find((d) => d.isActive && !d.isPrivate) ?? domains[0];
  const address = `usr${hex(5)}@${domain}`;
  const password = `Ab1!${hex(5)}`;

  try {
    const res = await http.post(`${MAILTM}/accounts`, { address, password });
    if (res.status === 429) throw new MailTmError("mail.tm: limite de peticiones alcanzado");
    if (res.status >= 400) throw new MailTmError(`mail.tm respondio HTTP ${res.status}`);
  } catch (cause) {
    if (cause instanceof MailTmError) throw cause;
    throw new NetworkError("No se pudo crear la cuenta temporal en mail.tm", { cause });
  }

  logMessage(`Email temporal creado (${address})`);
  return { address, password };
};
