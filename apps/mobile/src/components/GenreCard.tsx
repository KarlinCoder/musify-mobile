import { Pressable, Text } from "react-native";
import { generateColorRGB } from "@marko19907/string-to-color";
import { Link } from "expo-router";
import { Image } from "expo-image";

interface Props {
  genre: Genre;
}

export default function GenreCard({ genre }: Props) {
  const backgroundColor = generateColorRGB(genre.name, {
    lightness: 40,
    saturation: 30,
  });

  return (
    <Link href={`/genre/${genre.id}`} asChild>
      <Pressable
        style={{ backgroundColor }}
        className="relative w-full flex-row justify-between items-center h-25 rounded-md p-3 overflow-hidden active:opacity-90"
      >
        <Text
          className="text-white font-spotify-bold text-[17px] self-start z-1"
          numberOfLines={4}
        >
          {genre.name}
        </Text>

        <Image
          source={genre.picture}
          contentFit="cover"
          placeholderContentFit="cover"
          placeholder={require("../assets/images/fallback/playlist.png")}
          style={{
            width: 80,
            height: 80,
            position: "absolute",
            bottom: -10,
            right: -10,
            transform: "rotate(25deg)",
            borderRadius: 5,
          }}
        />
      </Pressable>
    </Link>
  );
}
