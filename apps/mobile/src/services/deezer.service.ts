import {
  mockGetTrack,
  mockGetTrackPreview,
  mockGetAlbum,
  mockGetArtist,
  mockGetPlaylist,
  mockGetPopular,
  mockGetTrackMix,
  mockGetArtistMix,
  mockGetSimilarTracks,
  mockGetSimilarArtists,
} from "../../mock-data";

import deezer from "deezer-sdk";
import axios from "axios";
import { DeezerChartsResponse } from "@/types/deezer-aux";
import { isOfficialDeezerAuthor } from "@/utils/is-official-plyalist";

// export const search = async (
//   query: string,
// ): Promise<> => {
//   await delay(MOCK_DELAY_MS);
//   return [];
// };

// export const getTrack = async (trackId: string): Promise<MFTrackPage> => {
//   try {
//     const track = await deezer.getTrack({
//       trackId,
//     });

//     return {
//       albumId: track!.album!.id,
//       artists: track!.contributors.edges.map((artist) => ({
//         id: artist.node.id,
//         name: artist.node.name,
//       })),
//       avg_colo: "",
//     };
//   } catch (error) {
//     if (error instanceof Error)
//       throw new Error(`Error en getTrack: "${error.message}"`);
//   }
// };

// export const getTrackPreview = async (trackId: string): Promise<string> => {
//   try {
//   } catch (error) {
//     if (error instanceof Error)
//       throw new Error(`Error en : "${error.message}"`);
//   }
// };

// export const getAlbum = async (albumId: string): Promise<MFAlbumPage> => {
//   try {
//   } catch (error) {
//     if (error instanceof Error)
//       throw new Error(`Error en : "${error.message}"`);
//   }
// };

// export const getArtist = async (artistId: string): Promise<MFArtistPage> => {
//   try {
//   } catch (error) {
//     if (error instanceof Error)
//       throw new Error(`Error en : "${error.message}"`);
//   }
// };

// export const getPlaylist = async (
//   playlistId: string,
// ): Promise<MFPlaylistPage> => {
//   try {
//   } catch (error) {
//     if (error instanceof Error)
//       throw new Error(`Error en : "${error.message}"`);
//   }
// };

export const getCharts = async (): Promise<MFPopular> => {
  try {
    // console.log(deezer.)
    const graphqlCharts = await deezer.getCharts({
      albumsFirst: 10,
      artistsFirst: 10,
      playlistsFirst: 10,
      tracksFirst: 10,
      countryCode: "es",
    });

    const { data: restCharts } = await axios.get<DeezerChartsResponse>(
      `ttps://musify-proxy.api.karlincoder.com/?url=https://api.deezer.com/chart/0`,
    );

    const mappedResponse: MFPopular = {
      tracks:
        graphqlCharts?.country?.tracks?.edges.map(({ node: track }) => {
          const trackObject: MFTrack = {
            id: track!.id ?? "[TRACK_ID]",
            albumId: track?.album?.id ?? "[ALBUM_ID]",
            artists: track?.contributors.edges.map((artist) => ({
              id: artist.node.id,
              name: artist.node.name,
            }))!,
            duration: track!.duration,
            explicit_lyrics: track?.isExplicit ?? false,
            image_url: track?.album?.cover?.urls[0] ?? null,
            title: track!.title,
          };

          return trackObject;
        }) ?? [],
      albums: restCharts.albums.data.map((album) => ({
        id: album.id.toString(),
        artist: {
          id: album.artist.id.toString(),
          name: album.artist.name,
        },
        explicit_lyrics: album.explicit_lyrics,
        image_url: album.cover_medium,
        record_type: album.record_type,
        title: album.title,
      })),
      artists: restCharts.artists.data.map((artist) => ({
        id: artist.id.toString(),
        image_url: artist.picture_medium,
        name: artist.name,
      })),
      playlists: restCharts.playlists.data.map((playlist) => ({
        id: playlist.id.toString(),
        image_url: playlist.picture_medium,
        is_official: isOfficialDeezerAuthor(playlist.user.name),
        nb_tracks: playlist.nb_tracks,
        title: playlist.title,
      })),
    };

    return mappedResponse;
  } catch (error) {
    if (error instanceof Error)
      throw new Error(`Error obteniendo los Charts: "${error.message}"`);
  }
  return mockGetPopular;
};

// export const getTrackMix = async (
//   trackIds: string[],
//   limit?: number,
// ): Promise<MFTrack[]> => {
//   try {
//   } catch (error) {
//     if (error instanceof Error)
//       throw new Error(`Error en : "${error.message}"`);
//   }
// };

// export const getArtistMix = async (
//   artistIds: string[],
//   limit?: number,
// ): Promise<MFTrack[]> => {
//   try {
//   } catch (error) {
//     if (error instanceof Error)
//       throw new Error(`Error en : "${error.message}"`);
//   }
// };

// export const getSimilarTracks = async (
//   trackId: string,
//   nb?: number,
// ): Promise<MFTrack[]> => {
//   try {
//   } catch (error) {
//     if (error instanceof Error)
//       throw new Error(`Error en : "${error.message}"`);
//   }
// };

// export const getSimilarArtists = async (
//   artistId: string,
//   first?: number,
// ): Promise<MFArtist[]> => {
//   try {
//   } catch (error) {
//     if (error instanceof Error)
//       throw new Error(`Error en : "${error.message}"`);
//   }
// };

// xd
