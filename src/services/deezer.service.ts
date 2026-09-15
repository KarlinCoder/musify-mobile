import {
  mockSearchTracks,
  mockSearchAlbums,
  mockSearchArtists,
  mockSearchPlaylists,
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

const MOCK_DELAY_MS = 4000;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const searchTracks = async (
  query: string,
  first?: number,
): Promise<MFTrack[]> => {
  await delay(MOCK_DELAY_MS);
  return mockSearchTracks;
};

export const searchAlbums = async (
  query: string,
  first?: number,
): Promise<MFAlbum[]> => {
  await delay(MOCK_DELAY_MS);
  return mockSearchAlbums;
};

export const searchArtists = async (
  query: string,
  first?: number,
): Promise<MFArtist[]> => {
  await delay(MOCK_DELAY_MS);
  return mockSearchArtists;
};

export const searchPlaylists = async (
  query: string,
  first?: number,
): Promise<MFPlaylist[]> => {
  await delay(MOCK_DELAY_MS);
  return mockSearchPlaylists;
};

export const getTrack = async (trackId: string): Promise<MFTrackPage> => {
  await delay(MOCK_DELAY_MS);
  return mockGetTrack;
};

export const getTrackPreview = async (
  trackId: string,
): Promise<string> => {
  await delay(MOCK_DELAY_MS);
  return mockGetTrackPreview;
};

export const getAlbum = async (albumId: string): Promise<MFAlbumPage> => {
  await delay(MOCK_DELAY_MS);
  return mockGetAlbum;
};

export const getArtist = async (artistId: string): Promise<MFArtistPage> => {
  await delay(MOCK_DELAY_MS);
  return mockGetArtist;
};

export const getPlaylist = async (
  playlistId: string,
): Promise<MFPlaylistPage> => {
  await delay(MOCK_DELAY_MS);
  return mockGetPlaylist;
};

export const getPopular = async (): Promise<MFPopular> => {
  await delay(MOCK_DELAY_MS);
  return mockGetPopular;
};

export const getTrackMix = async (
  trackIds: string[],
  limit?: number,
  startWithInputTrack?: boolean,
): Promise<MFTrack[]> => {
  await delay(MOCK_DELAY_MS);
  return mockGetTrackMix;
};

export const getArtistMix = async (
  artistIds: string[],
  limit?: number,
): Promise<MFTrack[]> => {
  await delay(MOCK_DELAY_MS);
  return mockGetArtistMix;
};

export const getSimilarTracks = async (
  trackId: string,
  nb?: number,
): Promise<MFTrack[]> => {
  await delay(MOCK_DELAY_MS);
  return mockGetSimilarTracks;
};

export const getSimilarArtists = async (
  artistId: string,
  first?: number,
): Promise<MFArtist[]> => {
  await delay(MOCK_DELAY_MS);
  return mockGetSimilarArtists;
};