import { useEffect, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import expoAppProxy, { type ProxyConfig } from "../../modules/expo-app-proxy";
import { fetch } from "expo/fetch";

const PROXY: ProxyConfig = {
  type: "http",
  host: "198.46.161.42",
  port: 5092,
  username: "ympyzbfs",
  password: "mqw3jdcuuzvw",
};

const TEST_URL = "http://ip-api.com/json/";

export default function ProxyTestScreen() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      expoAppProxy.setProxy(PROXY);
    } catch (error: any) {
      Alert.alert(
        "Error al configurar el proxy",
        error?.message ?? String(error),
      );
    }
  }, []);

  const handleFetch = async () => {
    setLoading(true);
    try {
      const response = await fetch(TEST_URL);
      const body = await response.text();
      Alert.alert("fetch vía proxy global", `${response.status}\n${body}`);
    } catch (error: any) {
      Alert.alert("Error", error?.message ?? String(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 items-center justify-center gap-4 bg-background p-6">
      <Text className="font-title text-3xl text-text-primary">
        expo-app-proxy global
      </Text>
      <Text className="text-center font-secondary text-text-secondary">
        setProxy() activa el proxy en toda la app al entrar. El botón hace un
        fetch normal, sin proxy explícito: la respuesta debe mostrar la IP del
        proxy.
      </Text>
      <Pressable
        onPress={handleFetch}
        disabled={loading}
        className="rounded-full bg-primary px-6 py-3 active:opacity-80 disabled:opacity-50"
      >
        <Text className="font-secondary text-base text-white">
          {loading ? "Cargando..." : "Hacer petición"}
        </Text>
      </Pressable>
    </View>
  );
}
