import "../global.css";
import "react-native-reanimated";

import { SplashScreen } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar, View } from "react-native";
import { NavigationBar } from "expo-navigation-bar";
import Navbar from "@/components/Navbar";
import { Drawer } from "expo-router/drawer";
import Sidebar from "@/components/Sidebar";
import { useEffect } from "react";
import { useAppFonts } from "@/hooks/useAppFonts";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { loaded, error } = useAppFonts();

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <SafeAreaView className="relative size-full bg-background-dark">
      <View className="size-full bg-background-dark">
        <Drawer
          drawerContent={() => <Sidebar />}
          screenOptions={{
            header: () => <Navbar />,
            drawerStyle: {
              borderRightWidth: 0,
              padding: 0,
              overflow: "hidden",
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              borderTopLeftRadius: 0,
              outline: "0",
              borderBottomLeftRadius: 0,
              backgroundColor: "#000",
            },
            drawerContentContainerStyle: {
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              borderRightWidth: 0,
            },
            drawerContentStyle: {
              borderRightWidth: 0,
            },
            drawerType: "slide",
          }}
        ></Drawer>
      </View>

      <StatusBar barStyle={"light-content"} />
      <NavigationBar style="dark" />
    </SafeAreaView>
  );
}
