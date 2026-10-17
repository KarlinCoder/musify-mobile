import { Pressable, Text, View } from "react-native";
import { Href, useRouter } from "expo-router";

interface Props {
  artist: MFArtist;
}

export default function ArtistCard({ artist }: Props) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/artist/${artist.id}` as Href)}
      className="p-1 rounded-lg w-full max-w-40 items-center active:bg-background-light"
    >
      <View className="w-full aspect-square bg-neutral-600 rounded-full border" />

      <View className="flex-row justify-between items-center">
        <Text
          numberOfLines={1}
          className="text-sm text-text font-subtitle text-center max-w-28"
        >
          {artist.name}
        </Text>
      </View>
    </Pressable>
  );
}
