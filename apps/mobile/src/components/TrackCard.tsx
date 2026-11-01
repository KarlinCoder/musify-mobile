import { Image } from "expo-image";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import { BottomSheet, Host } from "@expo/ui";
import { truncateText } from "@/utils/truncate-text";

interface Props {
  track: Track;
}

export default function TrackCard({ track }: Props) {
  const [imageLoading, setImageLoading] = useState(false);
  const [isActionsOpen, setIsActionsOpen] = useState(false);

  return (
    <>
      <View className="flex-row justify-between items-center p-2 w-full">
        <View className="flex-row items-center gap-3">
          <Image
            source={track.album.cover}
            contentFit="cover"
            onLoadStart={() => setImageLoading(true)}
            onLoad={() => setImageLoading(false)}
            style={{ width: 60, height: 60, borderRadius: 7 }}
          />

          <View className="gap-1">
            <Text className="text-text text-[17px] font-spotify-regular">
              {truncateText(track.title, 21)}
            </Text>
            <View className="flex-row items-center gap-1.5">
              {track.explicit_lyrics && (
                <View className="size-3.5 shrink-0 items-center justify-center rounded-xs bg-text-muted">
                  <Text className="font-spotify-bold text-[10px] leading-none text-black">
                    E
                  </Text>
                </View>
              )}
              <Text className="text-text-muted text-[13px] font-spotify-regular">
                {truncateText(
                  track.artists.map((artist) => artist.name).join(", "),
                  2,
                )}
              </Text>
            </View>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Opciones de ${track.title}`}
          hitSlop={8}
          onPress={() => setIsActionsOpen(true)}
          className="active:bg-black rounded-full p-1"
        >
          <Ionicons name="ellipsis-vertical-sharp" size={24} color="#b2b2b2" />
        </Pressable>
      </View>

      <Host>
        <BottomSheet
          isPresented={isActionsOpen}
          onDismiss={() => setIsActionsOpen(false)}
          snapPoints={[{ fraction: 0.5 }, "full"]}
          containerColor="#1F1F1F"
        >
          <View className="gap-4 p-2">
            <View className="gap-1">
              <Text className="text-text text-[18px] font-spotify-bold">
                {track.title}
              </Text>
              <Text className="text-text-muted text-[13px] font-spotify-regular">
                {track.artists.map((artist) => artist.name).join(", ")}
              </Text>
            </View>

            <View className="gap-2">
              <Pressable
                className="rounded-lg bg-[#333333] px-4 py-3"
                onPress={() => setIsActionsOpen(false)}
              >
                <Text className="text-text font-spotify-medium">
                  Reproducir
                </Text>
              </Pressable>
              <Pressable
                className="rounded-lg bg-[#333333] px-4 py-3"
                onPress={() => setIsActionsOpen(false)}
              >
                <Text className="text-text font-spotify-medium">
                  Añadir a la cola
                </Text>
              </Pressable>
            </View>
          </View>
        </BottomSheet>
      </Host>
    </>
  );
}
