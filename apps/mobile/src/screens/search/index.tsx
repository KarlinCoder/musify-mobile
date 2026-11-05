import AppTopBar from "@/components/AppTopBar";
import { Pressable, ScrollView, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import SearchButton from "./components/SearchButton";
import { useQuery } from "@tanstack/react-query";
import { getGenres } from "@/services/deezer.service";
import GenreCard from "@/components/GenreCard";
import { splitArray } from "../home/utils/split-array";
import Loader from "@/components/Loader";

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
    genres &&
    splitArray(
      genres.filter((genre) => genre.id !== "0"),
      Math.ceil(genres.length / 2),
    );

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

      <ScrollView
        className="flex-1 px-4"
        contentContainerClassName="pb-28"
        overScrollMode="never"
      >
        {isLoading && (
          <View className="size-full items-center justify-center">
            <Loader />
          </View>
        )}

        {error && <Text className="text-white">Error: {error.message}</Text>}

        {groupedGenres && (
          <View className="flex-row flex-wrap gap-3.5">
            {groupedGenres.map((group, index) => (
              <View key={index} className="flex-1 gap-3.5">
                {group.map((genre) => (
                  <GenreCard key={genre.id} genre={genre} />
                ))}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
    //
  );
}
