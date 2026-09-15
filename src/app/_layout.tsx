import "../global.css";
import "react-native-reanimated";

import { GestureHandlerRootView } from "react-native-gesture-handler";

import { Slot, SplashScreen } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import useLoadFonts from "../hooks/useLoadFonts";
import { View } from "react-native";
import Navbar from "@/components/Navbar";
import Customization from "./customization";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import EdgeOpenLayer from "@/components/EdgeOpenLayer";

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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <View className="relative flex-1 bg-background-dark">
          <Navbar showSidebar={showSidebar} onShowSidebar={handleShowSidebar} />

          {!showSidebar && <EdgeOpenLayer onOpen={handleShowSidebar} />}

          {showSidebar && <Sidebar onClose={handleShowSidebar} />}

          <Slot />
        </View>
      </SafeAreaProvider>

      <Customization />
    </GestureHandlerRootView>
  );
}
