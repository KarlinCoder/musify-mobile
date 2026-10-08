import { useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { fetchWithProxy } from "@/utils/fetchWithProxy";

export default function ProxyTestScreen() {
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    setLoading(true);
    try {
      const res = await fetchWithProxy(
        "http://ip-api.com/json/",
        {},
        {
          proxyUrl: "http://ympyzbfs:mqw3jdcuuzvw@198.46.161.42:5092",
        },
      );
      const text = await res.text();
      Alert.alert("ipinfo.io", text);
    } catch (error: any) {
      Alert.alert("Error", error?.message ?? String(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 items-center justify-center gap-4 bg-background p-6">
      <Text className="font-title text-3xl text-text-primary">
        fetchWithProxy test
      </Text>
      <Text className="text-center font-secondary text-text-secondary">
        Pulsa el botón para hacer una petición a https://ipinfo.io/json
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
