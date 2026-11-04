import { Text } from "react-native";
import { generateColor } from "@marko19907/string-to-color";

interface Props {
  genre: Genre;
}

export default function GenreCard({ genre }: Props) {
  const backgroundColor = generateColor(genre.name, {
    lightness: 75,
    saturation: 60,
  });
  return <Text style={{ backgroundColor }}>{genre.name}</Text>;
}
