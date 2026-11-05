import "../global.css";
import "react-native-reanimated";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { SplashScreen, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar, View } from "react-native";
import { NavigationBar } from "expo-navigation-bar";
import { ThemeProvider, DefaultTheme } from "expo-router/react-navigation";
import { useEffect } from "react";
import { useLoadAppFonts } from "@/hooks/useLoadAppFonts";
import AppNavbar from "@/components/AppNavbar";

SplashScreen.preventAutoHideAsync();

const transparentTheme: ReactNavigation.Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#121212",
  },
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // Mantener la caché durante 24 horas
    },
  },
});

export default function RootLayout() {
  const { loaded, error } = useLoadAppFonts();

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView className="relative size-full">
        <View className="size-full bg-background-dark">
          <ThemeProvider value={transparentTheme}>
            <Stack
              screenOptions={{
                headerShown: false,
                animation: "fade",
                animationDuration: 150,
              }}
            />
          </ThemeProvider>

          <AppNavbar />
        </View>

        <StatusBar barStyle={"light-content"} />
        <NavigationBar style="dark" />
      </SafeAreaView>
    </QueryClientProvider>
  );
}
