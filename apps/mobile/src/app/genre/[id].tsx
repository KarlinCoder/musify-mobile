import GenreScreen from "@/screens/genre/[id]";
import { useLocalSearchParams } from "expo-router";

export default function GenreRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <GenreScreen genreId={id} />;
}
