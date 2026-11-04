import deezer from "deezer-sdk";
import axios from "axios";
import type { DeezerChartsResponse } from "@/types/deezer-aux";
import { isOfficialDeezerAuthor } from "@/utils/is-official-plyalist";
import { DeezerGenre } from "@/types/deezer-public.typs";

export const getTrack = async (trackId: string): Promise<Track> => {
  try {
    const track = await deezer.getTrack({
      trackId,
    });

    return {
      id: track!.id,
      title: track!.title,
      album: {
        id: track!.album?.id ?? "",
        name: track!.album?.displayTitle ?? "",
        cover: track!.album?.cover?.urls[0] ?? "",
      },
      artists: track!.contributors.edges.map(({ node }) => ({
        id: node.id,
        name: node.name,
        picture: node.picture?.urls[0] ?? null,
      })),
      duration: track!.duration,
      explicit_lyrics: track!.isExplicit ?? false,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Error en getTrack: "${message}"`);
  }
};

export const getTrackPreview = async (_trackId: string): Promise<string> => {
  throw new Error("getTrackPreview no implementado");
};

export const getAlbum = async (_albumId: string): Promise<MFAlbumPage> => {
  throw new Error("getAlbum no implementado");
};

export const getArtist = async (_artistId: string): Promise<MFArtistPage> => {
  throw new Error("getArtist no implementado");
};

export const getPlaylist = async (
  _playlistId: string,
): Promise<MFPlaylistPage> => {
  throw new Error("getPlaylist no implementado");
};

export const getCharts = async (): Promise<Popular> => {
  try {
    // console.log(deezer.)
    const graphqlCharts = await deezer.getCharts({
      albumsFirst: 0,
      artistsFirst: 0,
      playlistsFirst: 0,
      tracksFirst: 10,
      countryCode: "US",
    });

    const { data: restCharts } = await axios.get<DeezerChartsResponse>(
      `https://musify-proxy.api.karlincoder.com/?url=https://api.deezer.com/chart/united-states`,
    );

    const mappedResponse: Popular = {
      tracks:
        graphqlCharts?.country?.tracks?.edges?.map(({ node: track }) => {
          const trackObject: Track = {
            id: track!.id,
            album: {
              id: track!.album?.id ?? "",
              name: track!.album?.displayTitle ?? "",
              cover: track!.album?.cover?.urls[0] ?? "",
            },
            artists:
              track?.contributors.edges.map((artist) => ({
                id: artist.node.id,
                name: artist.node.name,
                picture: artist.node.picture?.urls[0] ?? null,
              })) ?? [],
            duration: track!.duration,
            explicit_lyrics: track?.isExplicit ?? false,
            title: track!.title,
          };

          return trackObject;
        }) ?? [],
      albums: (restCharts?.albums?.data ?? []).map((album) => ({
        id: album.id.toString(),
        title: album.title,
        cover: album.cover_medium,
        artists: [
          {
            id: album.artist.id.toString(),
            name: album.artist.name,
            picture: null,
          },
        ],
        explicit_lyrics: album.explicit_lyrics,
        type:
          (album.record_type as string) === "ep"
            ? "EP"
            : (album.record_type as string) === "single"
              ? "SINGLE"
              : "ALBUM",
      })),
      artists: (restCharts?.artists?.data ?? []).map((artist) => ({
        id: artist.id.toString(),
        name: artist.name,
        picture: artist.picture_medium,
      })),
      playlists: (restCharts?.playlists?.data ?? []).map((playlist) => ({
        id: playlist.id.toString(),
        title: playlist.title,
        picture: playlist.picture_medium,
        is_official: isOfficialDeezerAuthor(playlist.user?.name ?? ""),
        nb_tracks: playlist.nb_tracks,
        description: null,
      })),
    };

    return mappedResponse;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Error obteniendo los Charts: "${message}"`);
  }
};

export const getGenres = async (): Promise<Genre[]> => {
  const { data } = await axios.get<{ data: DeezerGenre[] }>(
    `https://musify-proxy.api.karlincoder.com/?url=${encodeURIComponent("https://api.deezer.com/genre")}`,
  );

  const mappedGenres: Genre[] = data.data.map((genre) => {
    const mappedGenre: Genre = {
      id: genre.id.toString(),
      name: genre.name,
      picture: genre.picture,
    };
    return mappedGenre;
  });

  return mappedGenres;
};

export const getRecomendations = async (): Promise<Recomendations> => {
  const recomendations = await deezer.getRecommendations({
    artistPlaylistsFirst: 10,
    artistsFirst: 10,
    hotTracksLimit: 10,
    newReleasesFirst: 20,
    playlistsFirst: 10,
  });

  const recommendations = recomendations?.recommendations;

  if (!recommendations) {
    throw new Error("No se pudieron obtener las recomendaciones");
  }

  const mappedRecomendations: Recomendations = {
    artists: (recommendations.artists?.edges ?? []).map(({ node }) => ({
      id: node!.id,
      name: node!.name,
      picture: node!.picture?.urls[0] ?? null,
    })),
    artistsPlaylists: (recommendations.artistPlaylists?.edges ?? []).map(
      ({ node }) => ({
        id: node!.id,
        picture: node!.picture?.urls[0] ?? null,
        is_official: isOfficialDeezerAuthor(node!.owner?.name ?? ""),
        nb_tracks: node!.estimatedTracksCount,
        title: node!.title,
        description: node!.description,
      }),
    ),
    tracks: (recommendations.hotTracks ?? []).map((track) => ({
      id: track.id,
      title: track.title,
      album: {
        id: track.album?.id ?? "",
        name: track.album?.displayTitle ?? "",
        cover: track.album?.cover?.urls[0] ?? "",
      },
      artists: track.contributors.edges.map(({ node }) => ({
        id: node.id,
        name: node.name,
        picture: node.picture?.urls[0] ?? null,
      })),
      duration: track.duration,
      explicit_lyrics: track.isExplicit,
    })),
    newReleases: (recommendations.newReleases?.edges ?? []).map(({ node }) => {
      const release = node!;

      return {
        id: release.id,
        title: release.displayTitle,
        cover: release.cover?.urls[0] ?? null,
        artists: (release.contributors?.edges ?? []).map(
          ({ node: artist }) => ({
            id: artist.id,
            name: artist.name,
            picture: null,
          }),
        ),
        explicit_lyrics: release.isExplicit ?? false,
        type:
          release.type === "EP"
            ? "EP"
            : release.type === "SINGLES"
              ? "SINGLE"
              : "ALBUM",
      };
    }),
    playlists: recomendations.recommendations.playlists.edges.map(
      (playlist) => {
        const node = playlist.node!;

        return {
          id: node.id,
          title: node.title,
          description: node.description ?? null,
          is_official: isOfficialDeezerAuthor(node.owner!.name),
          nb_tracks: node.estimatedTracksCount,
          picture: node.picture!.urls[0] ?? null,
        };
      },
    ),
  };

  return mappedRecomendations;
};

export const getTrackMix = async (
  _trackIds: string[],
  _limit?: number,
): Promise<MFTrack[]> => {
  throw new Error("getTrackMix no implementado");
};

export const getArtistMix = async (
  _artistIds: string[],
  _limit?: number,
): Promise<MFTrack[]> => {
  throw new Error("getArtistMix no implementado");
};

export const getSimilarTracks = async (
  _trackId: string,
  _nb?: number,
): Promise<MFTrack[]> => {
  throw new Error("getSimilarTracks no implementado");
};

export const getSimilarArtists = async (
  _artistId: string,
  _first?: number,
): Promise<MFArtist[]> => {
  throw new Error("getSimilarArtists no implementado");
};
