import ArtistScreen from "@/screens/artist/[id]";
import { useLocalSearchParams } from "expo-router";

export default function ArtistRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <ArtistScreen artistId={id} />;
}
