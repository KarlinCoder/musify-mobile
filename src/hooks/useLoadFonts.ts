import { useFonts } from "expo-font";
import { SplashScreen } from "expo-router";
import { useEffect } from "react";

export default function useLoadFonts() {
  const [loaded, error] = useFonts({
    "Deezer Product Bold": require("../assets/fonts/deezer-bold.ttf"),
    "Spotify Text": require("../assets/fonts/SpotifyMixUI-Regular.ttf"),
    "Spotify Mono": require("../assets/fonts/SpotifyMixMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return false;
  } else {
    return true;
  }
}
