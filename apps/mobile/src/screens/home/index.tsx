import { Stack } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Avatar } from "@kolking/react-native-avatar";
import { getCharts } from "@/services/deezer.service";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Image } from "expo-image";
import { useQuery } from "@tanstack/react-query";
import { splitArray } from "./utils/split-array";

export default function HomeScreen() {
  const groups = ["Canciones", "Albumes", "Artistas", "Playlists"] as const;

  const { data, isLoading, error } = useQuery({
    queryKey: ["charts"],
    queryFn: getCharts,
    refetchInterval: 60 * 1000,
    staleTime: 60 * 1000,
  });

  // getCharts devuelve { tracks: Track[] }
  const tracks = data?.tracks ?? [];

  const groupedTracks = splitArray(tracks, 5);

  const [selectedGroup, setSelectedGroup] = useState<(typeof groups)[number]>();

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
                  <Text className={`text-[13px] ${textClass}`}>{group}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <View>
          <Text className="text-text-muted text-[13px] font-spotify-regular">
            Explora la musica que la gente ama actualmente
          </Text>
          <Text className="text-text text-[22px] font-spotify-bold">
            Canciones del momento
          </Text>

          {isLoading && <Text className="text-white">Cargando datos</Text>}

          {error != null && !isLoading && (
            <Text className="text-red-400">Error al cargar las canciones</Text>
          )}

          {!isLoading && !error && (
            <ScrollView horizontal pagingEnabled>
              {groupedTracks.map((group, index) => (
                <View key={index}>
                  {group.map((track) => (
                    <Text key={track.id}>{track.name}</Text>
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
