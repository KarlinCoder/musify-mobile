import { useFonts } from "expo-font";

export function useLoadAppFonts() {
  const [loaded, error] = useFonts({
    SpotifyMix: require("../assets/fonts/SpotifyMix-Regular.ttf"),
    "Spotify-Bold": require("../assets/fonts/SpotifyMix-Bold.ttf"),
    "Spotify-Medium": require("../assets/fonts/SpotifyMix-Medium.ttf"),
    "Spotify-Regular": require("../assets/fonts/SpotifyMix-Regular.ttf"),
    "Spotify-Mono": require("../assets/fonts/SpotifyMix-Mono.ttf"),
  });

  return { loaded, error };
}
