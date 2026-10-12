import type {
  ProxyConfig,
  SavedProxyConfig,
  ProxyTestResult,
} from "./ExpoAppProxy.types";

function unsupported(): never {
  throw new Error("ExpoAppProxy solo está disponible en Android.");
}

export default {
  setProxy(_config: ProxyConfig): boolean {
    return unsupported();
  },

  getProxy(): SavedProxyConfig | null {
    return unsupported();
  },

  clearProxy(): boolean {
    return unsupported();
  },

  testProxy(_config: ProxyConfig & { url?: string }): Promise<ProxyTestResult> {
    return unsupported();
  },
};
