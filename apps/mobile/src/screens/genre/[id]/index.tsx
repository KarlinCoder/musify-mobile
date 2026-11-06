import AlbumCard from "@/components/AlbumCard";
import ArtistCard from "@/components/ArtistCard";
import Loader from "@/components/Loader";
import PlaylistCard from "@/components/PlaylistCard";
import RowContainer from "@/screens/home/components/RowContainer";
import TracksSection from "@/screens/home/components/TracksSection";
import FloatingHeader from "@/components/FloatingHeader";
import { getGenre, getGenreChart } from "@/services/deezer.service";
import { useQueries } from "@tanstack/react-query";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

import { getColors } from "react-native-image-colors";
import { useEffect, useState } from "react";

interface ScreenProps {
  genreId: string;
}

export default function GenreScreen({ genreId }: ScreenProps) {
  const [averageImageColor, setAverageImageColor] = useState("");

  const results = useQueries({
    queries: [
      {
        queryKey: ["genre", genreId],
        queryFn: () => getGenre(genreId),
        refetchInterval: 60 * 1000,
        staleTime: 60 * 1000,
      },
      {
        queryKey: ["genre-chart", genreId],
        queryFn: () => getGenreChart(genreId),
        refetchInterval: 60 * 1000,
        staleTime: 60 * 1000,
      },
    ],
  });

  const [genreQuery, chartQuery] = results;

  const isLoading = results.some((q) => q.isLoading);
  const isError = results.some((q) => q.isError);
  const error = results.find((q) => q.isError)?.error;

  const genre = genreQuery.data;
  const genreChart = chartQuery.data;

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  useEffect(() => {
    (async () => {
      if (!genre?.picture) return;

      const color = await getColors(genre?.picture, {
        fallback: "#000",
        cache: true,
      });

      setAverageImageColor(
        color.platform === "android" ? color.average : "#000",
      );
    })();
  }, [genre?.picture]);

  if (isLoading) {
    return (
      <View className="size-full items-center justify-center">
        <Loader />
      </View>
    );
  }

  if (isError) {
    return (
      <View>
        <Text className="text-red-500">
          Error: {error?.message ?? "Error desconocido"}
        </Text>
      </View>
    );
  }

  return (
    <View className="size-full">
      <FloatingHeader
        title={genre?.name ?? ""}
        scrollY={scrollY}
        color={averageImageColor}
      />

      <Animated.ScrollView
        className="size-full"
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <View className="relative h-54 bg-black overflow-hidden">
          <Image
            source={genre?.picture}
            placeholder={require("../../../assets/images/fallback/playlist.png")}
            placeholderContentFit="cover"
            contentFit="cover"
            style={StyleSheet.absoluteFill}
          />

          <LinearGradient
            colors={["transparent", "#000"]}
            locations={[0.4, 1]}
            style={StyleSheet.absoluteFill}
            className="justify-end px-4 py-2"
          >
            <Text className="font-spotify-bold text-3xl text-white">
              {genre?.name}
            </Text>
          </LinearGradient>
        </View>

        <View className="p-4">
          <Text className="bg-white/15 rounded-full text-sm text-white self-start py-1 px-3">
            Lo mejor del {genre?.name} en la actualidad.
          </Text>

          <View className="gap-3 mt-3 pb-20">
            <TracksSection
              title="Lo mas escuchado del genero."
              tracks={genreChart?.tracks ?? []}
            />

            <RowContainer title="Albumes gustados">
              {genreChart?.albums.map((album) => (
                <AlbumCard key={album.id} album={album} />
              ))}
            </RowContainer>

            <RowContainer title="Playlist para disfrutar">
              {genreChart?.playlists.map((playlist) => (
                <PlaylistCard key={playlist.id} playlist={playlist} />
              ))}
            </RowContainer>

            <RowContainer title="Puedes ver tambien">
              {genreChart?.artists.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} />
              ))}
            </RowContainer>
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
}
