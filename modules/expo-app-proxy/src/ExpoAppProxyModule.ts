import { requireNativeModule } from "expo-modules-core";

import type {
  ProxyConfig,
  SavedProxyConfig,
  ProxyTestResult,
} from "./ExpoAppProxy.types";

interface ExpoAppProxyModuleInterface {
  setProxy(config: ProxyConfig): boolean;
  getProxy(): SavedProxyConfig | null;
  clearProxy(): boolean;
  testProxy(config: ProxyConfig & { url?: string }): Promise<ProxyTestResult>;
}

export default requireNativeModule<ExpoAppProxyModuleInterface>("ExpoAppProxy");
