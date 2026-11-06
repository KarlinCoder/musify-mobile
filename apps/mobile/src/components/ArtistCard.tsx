import { Image } from "expo-image";
import { Text, View } from "react-native";

interface Props {
  artist: Artist;
}

export default function ArtistCard({ artist }: Props) {
  return (
    <View className="gap-2 items-center">
      <Image
        source={artist.picture}
        placeholder={require("../assets/images/fallback/artist.png")}
        placeholderContentFit="cover"
        contentFit="cover"
        style={{ width: 160, height: 160, borderRadius: 99999999 }}
      />

      <Text
        numberOfLines={1}
        className="text-text text-[15px] font-spotify-medium text-center"
      >
        {artist.name}
      </Text>
    </View>
  );
}
