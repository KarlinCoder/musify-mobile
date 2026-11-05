import PlaylistScreen from "@/screens/playlist/[id]";
import { useLocalSearchParams } from "expo-router";

export default function PlaylistRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <PlaylistScreen playlistId={id} />;
}
