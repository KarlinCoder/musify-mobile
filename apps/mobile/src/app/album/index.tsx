import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import ExpoAppProxy, {
  type ProxyConfig,
  type ProxyType,
} from "../../../modules/expo-app-proxy";

const DEFAULT_URL = "https://ipinfo.io/json";
const DEFAULT_PROXY = "http://ympyzbfs:mqw3jdcuuzvw@38.154.185.97:6370";

function parseProxy(value: string): ProxyConfig {
  let rest = value.trim();
  let type: ProxyType = "http";

  const scheme = rest.match(/^([a-z0-9]+):\/\//i);
  if (scheme) {
    type = scheme[1].toLowerCase().startsWith("socks") ? "socks5" : "http";
    rest = rest.slice(scheme[0].length);
  }

  let username: string | undefined;
  let password: string | undefined;
  const at = rest.lastIndexOf("@");
  if (at !== -1) {
    const creds = rest.slice(0, at);
    rest = rest.slice(at + 1);
    const sep = creds.indexOf(":");
    if (sep !== -1) {
      username = decodeURIComponent(creds.slice(0, sep));
      password = decodeURIComponent(creds.slice(sep + 1));
    } else {
      username = decodeURIComponent(creds);
    }
  }

  const [host, portRaw] = rest.split(":");
  const port = portRaw ? Number(portRaw) : type === "socks5" ? 1080 : 8080;

  if (!host || !Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(
      "Proxy inválido: usa host:puerto o http://usuario:clave@host:puerto",
    );
  }

  return { type, host, port, username, password };
}

export default function AlbumScreen() {
  const [proxyInput, setProxyInput] = useState(DEFAULT_PROXY);
  const [urlInput, setUrlInput] = useState(DEFAULT_URL);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    setLoading(true);
    setResult("");
    setError("");

    try {
      const config = parseProxy(proxyInput);
      const url = urlInput.trim() || DEFAULT_URL;

      // El módulo nativo hace la petición con su propio cliente OkHttp
      // enrutado por el proxy indicado.
      const response = await ExpoAppProxy.testProxy({ ...config, url });

      setResult(
        `${response.status} ${response.success ? "OK" : "ERROR"}\n\n${response.body}`,
      );
    } catch (err: any) {
      setError(err?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-background-dark"
      keyboardShouldPersistTaps="handled"
    >
      <View className="gap-4 p-6">
        <Text className="font-title text-2xl text-white">AppProxy test</Text>

        <View className="gap-1">
          <Text className="font-subtitle text-text-muted">Proxy</Text>
          <TextInput
            value={proxyInput}
            onChangeText={setProxyInput}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="http://usuario:clave@host:puerto"
            placeholderTextColor="#666666"
            className="rounded-lg bg-background-light px-4 py-3 font-text text-white"
          />
        </View>

        <View className="gap-1">
          <Text className="font-subtitle text-text-muted">URL</Text>
          <TextInput
            value={urlInput}
            onChangeText={setUrlInput}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            placeholder="https://ipinfo.io/json"
            placeholderTextColor="#666666"
            className="rounded-lg bg-background-light px-4 py-3 font-text text-white"
          />
        </View>

        <Pressable
          onPress={handleFetch}
          disabled={loading}
          className="items-center rounded-full bg-primary px-6 py-3 active:opacity-80 disabled:opacity-50"
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="font-subtitle text-base text-white">Fetch</Text>
          )}
        </Pressable>

        {error ? <Text className="font-text text-red-500">{error}</Text> : null}

        <View className="gap-1">
          <Text className="font-subtitle text-text-muted">Resultado</Text>
          <Text
            selectable
            className="rounded-lg bg-background-light p-4 font-mono text-xs text-text"
          >
            {result || "—"}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
