import "../global.css";
import "react-native-reanimated";

import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import AsyncStorage from "@react-native-async-storage/async-storage";
//
import { SplashScreen, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar, View } from "react-native";
import { NavigationBar } from "expo-navigation-bar";
import { ThemeProvider, DefaultTheme } from "expo-router/react-navigation";
import { useEffect } from "react";
import { useLoadAppFonts } from "@/hooks/useLoadAppFonts";

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
      gcTime: 1000 * 60 * 60 * 3, // Mantener la caché durante 24 horas
    },
  },
});

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

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
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: asyncStoragePersister,
        maxAge: 1000 * 60 * 60 * 3, // Establecer el tiempo de validez máximo de la caché en 24 horas
      }}
    >
      <SafeAreaView className="relative size-full">
        <View className="size-full bg-background-dark">
          <ThemeProvider value={transparentTheme}>
            <Stack />
          </ThemeProvider>
        </View>

        <StatusBar barStyle={"light-content"} />
        <NavigationBar style="dark" />
      </SafeAreaView>
    </PersistQueryClientProvider>
  );
}
