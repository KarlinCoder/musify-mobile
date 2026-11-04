import AppTopBar from "@/components/AppTopBar";
import { FlatList, Pressable, ScrollView, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import SearchButton from "./components/SearchButton";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getGenres } from "@/services/deezer.service";
import GenreCard from "@/components/GenreCard";
import { splitArray } from "../home/utils/split-array";

export default function SearchScreen() {
  const {
    data: genres,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["deezer-genres"],
    queryFn: getGenres,
    refetchInterval: 60 * 1000,
    staleTime: 60 * 1000,
  });

  const groupedGenres =
    genres && splitArray(genres, Math.ceil(genres.length / 2));

  alert(groupedGenres);

  return (
    <View className="flex-1 gap-1">
      <AppTopBar>
        <View className="flex-row justify-between items-center w-full grow shrink">
          <Text className="text-text text-[21px] font-spotify-bold">
            Buscar
          </Text>

          <Pressable hitSlop={8} onPress={() => alert("Click")}>
            <Ionicons name="camera-outline" size={30} color="#fff" />
          </Pressable>
        </View>
      </AppTopBar>

      <View className="px-4 mt-5 pb-3">
        <SearchButton />
      </View>

      <ScrollView className="px-4 pb-10">
        <View className="flex-row gap-2 size-full flex-wrap">
          {isLoading && <Text className="text-white">Cargando generos</Text>}
          {error && <Text className="text-white">Error: {error.message}</Text>}

          {groupedGenres &&
            groupedGenres.map((group, index) => {
              return (
                <View key={index} className="size-10 grow shrink">
                  {group.map((genre) => (
                    <GenreCard key={genre.id} genre={genre} />
                  ))}
                </View>
              );
            })}
        </View>
      </ScrollView>
    </View>
    //
  );
}
