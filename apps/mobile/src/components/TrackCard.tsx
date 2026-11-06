import { Image } from "expo-image";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import { BottomSheet, Host, RNHostView } from "@expo/ui";
import { truncateText } from "@/utils/truncate-text";
import ExplicitMark from "./ExplicitMark";

interface Props {
  track: Track;
}

const TRACK_ACTIONS = [
  { id: "share", label: "Compartir", icon: "share-social-outline" },
  {
    id: "add-to-library",
    label: "Agregar a Biblioteca",
    icon: "add-circle-outline",
  },
  { id: "download", label: "Descargar", icon: "download-outline" },
  { id: "go-to-album", label: "Ir al álbum", icon: "albums-outline" },
  { id: "go-to-artist", label: "Ir al artista", icon: "person-outline" },
  {
    id: "go-to-radio",
    label: "Ir a radio de la canción",
    icon: "radio-outline",
  },
  { id: "view-lyrics", label: "Ver letra", icon: "document-text-outline" },
  {
    id: "view-credits",
    label: "Ver créditos de la canción",
    icon: "information-circle-outline",
  },
  {
    id: "show-musify-code",
    label: "Mostrar código de Musify",
    icon: "qr-code-outline",
  },
];

export default function TrackCard({ track }: Props) {
  const [isActionsOpen, setIsActionsOpen] = useState(false);

  return (
    <>
      <View className="flex-row justify-between items-center p-2 w-full">
        <View className="flex-row items-center gap-3">
          <Image
            source={track.album.cover}
            contentFit="cover"
            placeholder={require("../assets/images/fallback/track.png")}
            placeholderContentFit="cover"
            style={{ width: 53, height: 53, borderRadius: 4 }}
          />

          <View className="gap-1s">
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              className="text-text text-[17px] font-spotify-regular pr-10"
            >
              {truncateText(track.title, 27)}
            </Text>
            <View className="flex-row items-center gap-1.5">
              {track.explicit_lyrics && <ExplicitMark />}

              <Text className="text-text-muted text-[13px] font-spotify-regular">
                {truncateText(
                  track.artists.map((artist) => artist.name).join(", "),
                  20,
                )}
              </Text>
            </View>
          </View>
        </View>

        <Pressable
          hitSlop={8}
          onPress={() => setIsActionsOpen(true)}
          className="rounded-full p-1"
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
          <RNHostView>
            <View className="flex-1">
              <View className="flex-row items-center gap-2 w-full h-15">
                <Image
                  source={track.album.cover}
                  contentFit="cover"
                  placeholder={require("../assets/images/fallback/track.png")}
                  placeholderContentFit="cover"
                  style={{ aspectRatio: 1, height: "100%", borderRadius: 5 }}
                />
                <View className="flex-col justify-center items-start">
                  <Text
                    numberOfLines={2}
                    className="text-white text-[17px] font-spotify-regular"
                  >
                    {track.title}
                  </Text>
                  <Text className="text-text-muted text-[14px] font-spotify-regular">
                    {track.artists.map((track) => track.name).join(", ")}
                  </Text>
                </View>
              </View>

              <View className="w-full bg-white/20 h-px my-3 mt-5" />

              <View className="size-full">
                {TRACK_ACTIONS.map((option) => (
                  <Pressable
                    key={option.id}
                    className="flex-row items-center justify-start gap-3 px-2 py-3 active:opacity-60"
                  >
                    <Ionicons name={option.icon} size={27} color={"#B3B3B3"} />
                    <Text className="text-white font-spotify-regular text-[17px]">
                      {option.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </RNHostView>
        </BottomSheet>
      </Host>
    </>
  );
}
