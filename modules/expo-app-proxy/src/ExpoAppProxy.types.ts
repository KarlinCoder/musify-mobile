export type ProxyType = "http" | "socks5";

export interface ProxyConfig {
  type: ProxyType;
  host: string;
  port: number;
  username?: string;
  password?: string;
}

export interface SavedProxyConfig {
  type: ProxyType;
  host: string;
  port: number;
  hasAuth: boolean;
}

export interface ProxyTestResult {
  success: boolean;
  status: number;
  body: string;
}
