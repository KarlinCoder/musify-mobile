import { Image } from "expo-image";
import { Text, View } from "react-native";

interface Props {
  playlist: Playlist;
}

export default function PlaylistCard({ playlist }: Props) {
  return (
    <View className="gap-2">
      <Image
        source={playlist.picture}
        placeholder={require("../assets/images/fallback/playlist.png")}
        placeholderContentFit="cover"
        contentFit="cover"
        style={{ width: 160, height: 160, borderRadius: 5 }}
      />

      <View className="gap-1">
        <Text
          numberOfLines={2}
          ellipsizeMode="tail"
          className="w-40 h-9 leading-4.5 text-text-muted text-[13px] font-spotify-regular"
        >
          {`${playlist.title}. ${playlist.description ?? ""}`}
        </Text>
      </View>
    </View>
  );
}
