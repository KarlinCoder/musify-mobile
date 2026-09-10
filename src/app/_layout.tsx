import { Slot, Stack } from "expo-router";
import { Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Text className="w-40 text-5xl bg-red-600">Hola mundo</Text>
      <Slot />
    </SafeAreaProvider>
  );
}
