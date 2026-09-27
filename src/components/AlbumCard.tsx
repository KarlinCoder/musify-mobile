import { Pressable, Text, View } from "react-native";
import DetailsButton from "./DetailsButton";
import ExplicitMark from "./ExplicitMark";
import { Href, useRouter } from "expo-router";

interface Props {
  album: MFAlbum;
}

export default function AlbumCard({ album }: Props) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/album/${album.id}` as Href)}
      className="p-1 rounded-lg w-full max-w-40 h-fit active:bg-background-light"
    >
      <View className="w-full aspect-square border bg-neutral-600 rounded-lg" />

      <View className="p-1.5 flex-row justify-between items-center">
        <View className="max-w-36">
          <Text numberOfLines={1} className="text-sm text-text font-subtitle">
            {album.title}
          </Text>

          <View className="flex-row items-center gap-2">
            {album.explicit_lyrics && <ExplicitMark />}

            <Text className="text-text-muted text-xs">{album.artist.name}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
