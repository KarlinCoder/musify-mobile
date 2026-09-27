import { formatSecondsToMinutes } from "@/lib/utils";
import { Pressable, Text, View } from "react-native";
import { Href, useRouter } from "expo-router";
import ExplicitMark from "./ExplicitMark";
import TrackCardDropdown from "./TrackCardDropdown";

interface Props {
  track: MFTrack;
  listPosition?: number;
}

export default function TrackCard({ track, listPosition }: Props) {
  const router = useRouter();
  const parsedDuration = formatSecondsToMinutes(track.duration);

  return (
    <Pressable
      onPress={() => router.replace(`/track/${track.id}` as Href)}
      className="flex-row justify-between gap-5 items-center active:bg-background-light p-1 rounded-md "
    >
      <View className="grow flex-row gap-2 items-center max-w-60 w-full">
        <View className="size-13 bg-neutral-600 rounded-lg" />

        <View className="grow justify-center min-w-0">
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            className="text-sm font-subtitle text-text max-w-47"
          >
            {track.title}
          </Text>
          <View className="flex-row items-center gap-1">
            {track.explicit_lyrics && <ExplicitMark />}
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              className="text-xs font-secondary text-text-muted text-ellipsis max-w-45 "
            >
              {track.artists.map((artist) => artist.name).join(", ")}
            </Text>
          </View>
        </View>
      </View>

      <View className="flex-row items-center justify-end gap-1">
        <Text className="font-mono text-xs text-text-muted">
          {parsedDuration}
        </Text>

        <TrackCardDropdown track={track} />
      </View>
    </Pressable>
  );
}
