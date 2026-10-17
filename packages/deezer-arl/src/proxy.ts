import axios from "axios";
import { SocksProxyAgent } from "socks-proxy-agent";
import { USER_AGENT } from "./constants";

type ProxyProtocol = "http" | "https" | "socks4" | "socks4a" | "socks5" | "socks5h";

const parseProxy = (proxy: string) => {
  const u = new URL(proxy.includes("://") ? proxy : `http://${proxy}`);
  const hasAuth = !!(u.username && u.password);

  return {
    protocol: u.protocol.replace(":", "").toLowerCase() as ProxyProtocol,
    host: u.hostname,
    port: Number(u.port),
    ...(hasAuth && { username: u.username, password: u.password }),
  };
};

const isSocks = (protocol: ProxyProtocol) =>
  protocol === "socks4" ||
  protocol === "socks4a" ||
  protocol === "socks5" ||
  protocol === "socks5h";

export const createHttpClient = (proxy?: string) => {
  const common = {
    validateStatus: () => true,
    // timeout: 300,
    headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
  };

  if (!proxy) {
    return axios.create({ ...common, proxy: null });
  }

  const p = parseProxy(proxy);

  if (isSocks(p.protocol)) {
    const auth = p.username && p.password ? `${p.username}:${p.password}@` : "";
    const agent = new SocksProxyAgent(
      `${p.protocol}://${auth}${p.host}:${p.port}`,
    );

    return axios.create({
      ...common,
      proxy: false,
      httpAgent: agent,
      httpsAgent: agent,
    });
  }

  return axios.create({
    ...common,
    proxy: {
      protocol: p.protocol,
      host: p.host,
      port: p.port,
      ...(p.username &&
        p.password && {
          auth: { username: p.username, password: p.password },
        }),
    },
  });
};
