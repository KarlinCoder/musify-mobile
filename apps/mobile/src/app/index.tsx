import AlbumCard from "@/components/AlbumCard";
import ArtistCard from "@/components/ArtistCard";
import Loader from "@/components/Loader";
import ScreenLoader from "@/components/LoaderScreen";
import PlaylistCard from "@/components/PlaylistCard";
import TrackCard from "@/components/TrackCard";
import { getPopular } from "@/services/deezer.service";
import { useEffect, useState } from "react";
import { FlatList, Pressable, ScrollView, Text, View } from "react-native";

const topLinks = [
  { label: "Canciones", color: "#FFADAD" },
  { label: "Albumes", color: "#A0C4FF" },
  { label: "Artistas", color: "#FDFFB6" },
  { label: "Playlists", color: "#CAFFBF" },
];

export default function HomeScreen() {
  const [popular, setPopular] = useState<MFPopular | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getPopular();
      setPopular(data);
    };
    fetchData();
  }, []);

  if (!popular) return <ScreenLoader />;

  const ITEMS_PER_COLUMN_TRACK = 6;
  const tracks = popular.tracks ?? [];
  const trackColumns: (typeof tracks)[] = [];
  for (let i = 0; i < tracks.length; i += ITEMS_PER_COLUMN_TRACK) {
    trackColumns.push(tracks.slice(i, i + ITEMS_PER_COLUMN_TRACK));
  }

  const ITEMS_PER_COLUMN_ALBUM = 2;
  const albums = popular.albums ?? [];
  const albumColumns: (typeof albums)[] = [];
  for (let i = 0; i < albums.length; i += ITEMS_PER_COLUMN_ALBUM) {
    albumColumns.push(albums.slice(i, i + ITEMS_PER_COLUMN_ALBUM));
  }

  const ITEMS_PER_COLUMN_ARTIST = 2;
  const artists = popular.artists ?? [];
  const artistColumns: (typeof artists)[] = [];
  for (let i = 0; i < artists.length; i += ITEMS_PER_COLUMN_ARTIST) {
    artistColumns.push(artists.slice(i, i + ITEMS_PER_COLUMN_ARTIST));
  }

  const ITEMS_PER_COLUMN_PLAYLIST = 2;
  const playlists = popular.playlists ?? [];
  const playlistColumns: (typeof playlists)[] = [];
  for (let i = 0; i < playlists.length; i += ITEMS_PER_COLUMN_PLAYLIST) {
    playlistColumns.push(playlists.slice(i, i + ITEMS_PER_COLUMN_PLAYLIST));
  }

  return (
    <ScrollView className="size-full bg-background-dark">
      <View className="gap-3 mt-5">
        <Text className="text-text font-title text-2xl px-4">
          Descubre lo mejor del momento
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="flex-row gap-1.5 px-2"
        >
          {topLinks.map((link) => (
            <Pressable
              key={link.label}
              style={{
                backgroundColor: `${link.color}dd`,
              }}
              className="rounded-full py-2 px-4 active:opacity-90"
            >
              <Text className="text-background text-sm font-title">
                {link.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View className="gap-1 bg-background-dark mt-5 px-2">
        <Text className="text-text text-xl font-title font-semibold px-2">
          Canciones del momento
        </Text>

        <FlatList
          data={trackColumns}
          horizontal
          pagingEnabled
          snapToAlignment="start"
          decelerationRate={"fast"}
          keyExtractor={(_, i) => String(i)}
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-0 "
          renderItem={({ item: columna }) => (
            <View className="w-[calc(100vw-50px)]">
              {columna.map((track) => (
                <TrackCard key={track.id} track={track} />
              ))}
            </View>
          )}
        />
      </View>

      <View className="gap-1 bg-background-dark mt-5 px-2">
        <Text className="text-text text-xl font-title px-2">
          Albumes del momento
        </Text>

        <FlatList
          data={albumColumns}
          horizontal
          pagingEnabled
          snapToAlignment="start"
          decelerationRate={"fast"}
          keyExtractor={(_, i) => String(i)}
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-0 "
          renderItem={({ item: columna }) => (
            <View className="">
              {columna.map((album) => (
                <AlbumCard key={album.id} album={album} />
              ))}
            </View>
          )}
        />
      </View>

      <View className="gap-1 bg-background-dark mt-5 px-2">
        <Text className="text-text text-xl font-title px-2">
          Artistas del momento
        </Text>

        <FlatList
          data={artistColumns}
          horizontal
          pagingEnabled
          snapToAlignment="start"
          decelerationRate={"fast"}
          keyExtractor={(_, i) => String(i)}
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-0 "
          renderItem={({ item: columna }) => (
            <View className="">
              {columna.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} />
              ))}
            </View>
          )}
        />
      </View>

      <View className="gap-1 bg-background-dark mt-5 mb-5 px-2">
        <Text className="text-text text-xl font-title px-2">
          Playlists del momento
        </Text>

        <FlatList
          data={playlistColumns}
          horizontal
          pagingEnabled
          snapToAlignment="start"
          decelerationRate={"fast"}
          keyExtractor={(_, i) => String(i)}
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-0 "
          renderItem={({ item: columna }) => (
            <View className="">
              {columna.map((playlist) => (
                <PlaylistCard key={playlist.id} playlist={playlist} />
              ))}
            </View>
          )}
        />
      </View>
    </ScrollView>
  );
}
