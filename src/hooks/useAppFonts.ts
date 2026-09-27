import { useFonts } from "expo-font";

export function useAppFonts() {
  const [loaded, error] = useFonts({
    SpotifyMix: require("../assets/fonts/SpotifyMix-Regular.ttf"),
    "SpotifyMix-Bold": require("../assets/fonts/SpotifyMix-Bold.ttf"),
    "SpotifyMix-Medium": require("../assets/fonts/SpotifyMix-Medium.ttf"),
    "SpotifyMix-Regular": require("../assets/fonts/SpotifyMix-Regular.ttf"),
    "SpotifyMix-Mono": require("../assets/fonts/SpotifyMix-Mono.ttf"),
  });

  return { loaded, error };
}
