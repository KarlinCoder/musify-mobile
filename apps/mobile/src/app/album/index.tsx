import AlbumScreen from "@/screens/album/[id]";
import { useLocalSearchParams } from "expo-router";

export default function AlbumRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <AlbumScreen albumId={id} />;
}
