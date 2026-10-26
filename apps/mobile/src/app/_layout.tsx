import "../global.css";
import "react-native-reanimated";

import { SplashScreen, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar, View } from "react-native";
import { NavigationBar } from "expo-navigation-bar";
import { useEffect } from "react";
import { useLoadAppFonts } from "@/hooks/useLoadAppFonts";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { loaded, error } = useLoadAppFonts();

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <SafeAreaView className="relative size-full">
      <View className="size-full">
        <Stack />
      </View>

      <StatusBar barStyle={"light-content"} />
      <NavigationBar style="dark" />
    </SafeAreaView>
  );
}
