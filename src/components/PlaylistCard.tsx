import { Pressable, Text, View } from "react-native";
import { Href, useRouter } from "expo-router";
import VerifiedIcon from "./VerifiedIcon";

interface Props {
  playlist: MFPlaylist;
}

export default function PlaylistCard({ playlist }: Props) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/playlist/${playlist.id}` as Href)}
      className="p-1 rounded-lg max-w-40 h-fit active:bg-background-light"
    >
      <View className="w-full aspect-square border bg-neutral-600 rounded-lg" />

      <View className="p-1.5 flex-row justify-between items-center">
        <View className="flex-1 pr-2">
          <Text numberOfLines={1} className="text-sm text-text font-subtitle">
            {playlist.title}
          </Text>

          <View className="flex-row items-center gap-1">
            {playlist.is_official && <VerifiedIcon />}

            <Text className="text-text-muted text-xs">
              {playlist.nb_tracks} canciones
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
