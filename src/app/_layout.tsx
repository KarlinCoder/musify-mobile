import "../global.css";
import { Slot, Stack } from "expo-router";
import { Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <View className="flex-1 bg-black">
        <Slot />
      </View>

      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}
