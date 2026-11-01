import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Avatar } from "@kolking/react-native-avatar";
import { getCharts } from "@/services/deezer.service";
import { useQuery } from "@tanstack/react-query";
import { splitArray } from "./utils/split-array";
import TrackCard from "@/components/TrackCard";

export default function HomeScreen() {
  const groups = ["Canciones", "Albumes", "Artistas", "Playlists"] as const;

  const { data, isLoading, error } = useQuery({
    queryKey: ["charts"],
    queryFn: getCharts,
    refetchInterval: 60 * 1000,
    staleTime: 60 * 1000,
  });

  const tracks = data?.tracks.slice(0, 9) ?? [];
  const groupedTracks = splitArray(tracks, 3);

  const [selectedGroup, setSelectedGroup] = useState<(typeof groups)[number]>();

  const [containerWidth, setContainerWidth] = useState(0);
  const [carouselWidth, setCarouselWidth] = useState(0);

  const PAGE_WIDTH = containerWidth * 0.97;
  const GAP = 12;

  return (
    <>
      <Stack.Header hidden />

      <View className="flex-1 gap-3 items-start justify-start p-4">
        <View className="flex-row items-center gap-2 -mr-4 relative">
          <Avatar name="Giancarlo Dennis" size={38} />

          <ScrollView
            horizontal
            overScrollMode="never"
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-2 pl-2"
          >
            {groups.map((group) => {
              const backgroundClass =
                selectedGroup === group ? "bg-primary" : "bg-[#333333]";
              const textClass =
                selectedGroup === group ? "text-black" : "text-white";

              return (
                <Pressable
                  key={group}
                  onPress={() => setSelectedGroup(group)}
                  className={`rounded-full px-4 py-2 ${backgroundClass}`}
                >
                  <Text
                    className={`text-[13px] ${textClass} font-spotify-medium`}
                  >
                    {group}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <View
          className="w-full"
          onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
        >
          <Text className="text-text-muted text-[13px] font-spotify-regular">
            Explora la musica que la gente ama actualmente
          </Text>
          <Text className="text-text text-[21px] font-spotify-bold">
            Escuchar ahora
          </Text>

          {isLoading && <Text className="text-white">Cargando datos</Text>}

          {error && (
            <Text className="text-red-400">Error al cargar las canciones</Text>
          )}

          {!isLoading && !error && containerWidth > 0 && (
            <ScrollView
              horizontal
              onLayout={(e) => setCarouselWidth(e.nativeEvent.layout.width)}
              showsHorizontalScrollIndicator={false}
              snapToInterval={PAGE_WIDTH + GAP}
              snapToAlignment="start"
              decelerationRate="fast"
              className="-mx-4"
              overScrollMode="never"
              alwaysBounceHorizontal
              bounces={false}
              contentContainerClassName="mt-2 px-1.5"
              contentContainerStyle={{
                gap: GAP,
                paddingRight: Math.max(0, carouselWidth - PAGE_WIDTH),
              }}
            >
              {groupedTracks.map((tracksInGroup, index) => (
                <View
                  key={index}
                  style={{
                    width: PAGE_WIDTH,
                  }}
                >
                  {tracksInGroup.map((track) => (
                    <TrackCard key={track.id} track={track} />
                  ))}
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      </View>
    </>
  );
}
