import "react-native-reanimated";
import "../global.css";

import { GestureHandlerRootView } from "react-native-gesture-handler";

import { Slot, SplashScreen } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import useLoadFonts from "../hooks/useLoadFonts";
import { StatusBar, View } from "react-native";
import Navbar from "@/components/Navbar";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import EdgeOpenLayer from "@/components/EdgeOpenLayer";

import { NavigationBar } from "expo-navigation-bar";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const fontsLoaded = useLoadFonts();
  const [showSidebar, setShowSidebar] = useState(false);

  const handleShowSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <SafeAreaView>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <View className="relative flex-1 bg-red-500">
            <Navbar
              showSidebar={showSidebar}
              onShowSidebar={handleShowSidebar}
            />

            {!showSidebar && <EdgeOpenLayer onOpen={handleShowSidebar} />}

            {showSidebar && <Sidebar onClose={handleShowSidebar} />}

            <Slot />
          </View>
        </GestureHandlerRootView>
      </SafeAreaView>

      <StatusBar barStyle={"light-content"} />
      {/* <NavigationBar style="dark" /> */}
    </>
  );
}
