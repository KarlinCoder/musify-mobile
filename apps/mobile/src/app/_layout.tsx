import "../global.css";
import "react-native-reanimated";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { SplashScreen, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Platform, StatusBar, Text, View } from "react-native";
import { NavigationBar } from "expo-navigation-bar";
import { ThemeProvider, DefaultTheme } from "expo-router/react-navigation";
import { useEffect } from "react";
import { SQLiteProvider } from "expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { useLoadAppFonts } from "@/hooks/useLoadAppFonts";
import AppNavbar from "@/components/AppNavbar";
import { DATABASE_NAME, db, expoDb } from "@/db";
import migrations from "@/db/migrations/migrations";

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

function DrizzleStudioDevTool() {
  useDrizzleStudio(expoDb);
  return null;
}

export default function RootLayout() {
  const { loaded, error } = useLoadAppFonts();
  const { success, error: migrationError } = useMigrations(db, migrations);

  useEffect(() => {
    if ((loaded || error) && (success || migrationError)) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [loaded, error, success, migrationError]);

  if (migrationError) {
    return (
      <SafeAreaView className="relative size-full">
        <View className="flex-1 items-center justify-center gap-2 bg-background-dark px-6">
          <Text className="text-center font-spotify-bold text-lg text-text">
            No se pudo inicializar la base de datos
          </Text>
          <Text className="text-center text-sm text-muted">
            {migrationError.message}
          </Text>
        </View>

        <StatusBar barStyle={"light-content"} />
        <NavigationBar style="dark" />
      </SafeAreaView>
    );
  }

  if ((!loaded && !error) || !success) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SQLiteProvider
        databaseName={DATABASE_NAME}
        options={{ enableChangeListener: true }}
      >
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

        {__DEV__ && Platform.OS !== "web" ? <DrizzleStudioDevTool /> : null}
      </SQLiteProvider>
    </QueryClientProvider>
  );
}
