import { useState } from "react";
import { FlatList, Pressable, ScrollView, Text, View } from "react-native";
import { getCharts, getRecomendations } from "@/services/deezer.service";
import { useQueries } from "@tanstack/react-query";
import TracksSection from "./components/TracksSection";
import RowContainer from "./components/RowContainer";
import AlbumCard from "@/components/AlbumCard";
import ArtistCard from "@/components/ArtistCard";
import PlaylistCard from "@/components/PlaylistCard";
import AppTopBar from "@/components/AppTopBar";
import TrackCard from "@/components/TrackCard";
import Loader from "@/components/Loader";

export default function HomeScreen() {
  const groups = ["Canciones", "Albumes", "Artistas", "Playlists"] as const;

  const [chartsQuery, recommendationsQuery] = useQueries({
    queries: [
      {
        queryKey: ["charts"],
        queryFn: getCharts,
        refetchInterval: 60 * 1000,
        staleTime: 60 * 1000,
      },
      {
        queryKey: ["recomendations"],
        queryFn: getRecomendations,
        refetchInterval: 60 * 1000,
        staleTime: 60 * 1000,
      },
    ],
  });

  const dataCharts = chartsQuery.data;
  const isLoadingCharts = chartsQuery.isLoading;
  const errorCharts = chartsQuery.error;

  const dataRecommendations = recommendationsQuery.data;
  const isLoadingRecommendations = recommendationsQuery.isLoading;
  const errorRecommendations = recommendationsQuery.error;

  const [selectedGroup, setSelectedGroup] = useState<(typeof groups)[number]>();

  if (isLoadingCharts || isLoadingRecommendations) {
    return (
      <View className="size-full items-center justify-center">
        <Loader />
      </View>
    );
  }

  return (
    <View className="flex-1 gap-3 items-start justify-start">
      <AppTopBar scroll>
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
              <Text className={`text-[13px] ${textClass} font-spotify-medium`}>
                {group}
              </Text>
            </Pressable>
          );
        })}
      </AppTopBar>

      {/* Home sections */}
      <ScrollView className="px-4">
        <Text className="text-text-muted text-[13px] font-spotify-regular">
          Explora la musica que la gente ama actualmente
        </Text>

        {errorCharts && (
          <Text className="text-red-400">
            Error al cargar los charts: {errorCharts.message}
          </Text>
        )}

        {errorRecommendations && (
          <Text className="text-red-400">
            Error al cargar las recomendaciones: {errorRecommendations.message}
          </Text>
        )}

        {dataCharts && dataRecommendations && (
          <View className="gap-3 pb-30">
            <TracksSection title="Escuchar ahora" tracks={dataCharts.tracks} />

            <RowContainer title="Lanzamientos recientes">
              {dataRecommendations.newReleases.map((release) => (
                <AlbumCard key={release.id} album={release} />
              ))}
            </RowContainer>

            <TracksSection
              title="Te puede gustar"
              tracks={dataRecommendations.tracks}
            />

            <RowContainer title="Albumes del momento">
              {dataCharts.albums.map((album) => (
                <AlbumCard key={album.id} album={album} />
              ))}
            </RowContainer>

            <RowContainer title="Listas mas gustadas">
              {dataCharts.playlists.map((playlist) => (
                <PlaylistCard key={playlist.id} playlist={playlist} />
              ))}
            </RowContainer>
            <RowContainer title="Artistas mas sonados">
              {dataCharts.artists.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} />
              ))}
            </RowContainer>

            <RowContainer title="Lo mejor de los artistas">
              {dataRecommendations.artistsPlaylists.map((playlist) => (
                <PlaylistCard key={playlist.id} playlist={playlist} />
              ))}
            </RowContainer>

            <RowContainer title="Tambien te sugerimos">
              {dataRecommendations.artists.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} />
              ))}
            </RowContainer>

            <RowContainer title="Listas que te pueden gustar">
              {dataRecommendations.playlists.map((playlist) => (
                <PlaylistCard key={playlist.id} playlist={playlist} />
              ))}
            </RowContainer>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
