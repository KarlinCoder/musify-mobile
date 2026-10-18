import { GraphQLClient } from "graphql-request";
import {
  AddAlbumToFavoriteDocument,
  AddAlbumToFavoriteMutationVariables,
  AddArtistToFavoriteDocument,
  AddArtistToFavoriteMutationVariables,
  AddAudiobookToFavoriteDocument,
  AddAudiobookToFavoriteMutationVariables,
  AddPlaylistToFavoriteDocument,
  AddPlaylistToFavoriteMutationVariables,
  AddPodcastToFavoriteDocument,
  AddPodcastToFavoriteMutationVariables,
  AddTrackToFavoriteDocument,
  AddTrackToFavoriteMutationVariables,
  AddTracksToPlaylistDocument,
  AddTracksToPlaylistMutationVariables,
  BookmarkPodcastEpisodeDocument,
  BookmarkPodcastEpisodeMutationVariables,
  CreatePlaylistDocument,
  CreatePlaylistMutationVariables,
  DeletePlaylistDocument,
  DeletePlaylistMutationVariables,
  GetAlbumDocument,
  GetAlbumQueryVariables,
  GetArtistDocument,
  GetArtistMixDocument,
  GetArtistMixQueryVariables,
  GetArtistQueryVariables,
  GetAudiobookChapterDocument,
  GetAudiobookChapterQueryVariables,
  GetAudiobookDocument,
  GetAudiobookQueryVariables,
  GetChartsDocument,
  GetChartsQueryVariables,
  GetFavoriteAlbumsDocument,
  GetFavoriteAlbumsQueryVariables,
  GetFavoriteArtistsDocument,
  GetFavoriteArtistsQueryVariables,
  GetFavoriteAudiobooksDocument,
  GetFavoriteAudiobooksQueryVariables,
  GetFavoritePlaylistsDocument,
  GetFavoritePlaylistsQueryVariables,
  GetFavoritePodcastsDocument,
  GetFavoritePodcastsQueryVariables,
  GetFavoriteTracksDocument,
  GetFavoriteTracksQueryVariables,
  GetFlowBatchDocument,
  GetFlowBatchQueryVariables,
  GetFlowConfigTracksDocument,
  GetFlowConfigTracksQueryVariables,
  GetFlowConfigsDocument,
  GetFlowConfigsQueryVariables,
  GetFlowDocument,
  GetFlowQueryVariables,
  GetLivestreamDocument,
  GetLivestreamQueryVariables,
  GetMadeForMeDocument,
  GetMadeForMeQueryVariables,
  GetMeDocument,
  GetMeQueryVariables,
  GetMusicTogetherAffinityDocument,
  GetMusicTogetherAffinityQueryVariables,
  GetMusicTogetherGroupDocument,
  GetMusicTogetherGroupQueryVariables,
  GetMusicTogetherGroupsDocument,
  GetMusicTogetherGroupsQueryVariables,
  GetPersonalTracksDocument,
  GetPersonalTracksQueryVariables,
  GetPlaylistDocument,
  GetPlaylistQueryVariables,
  GetPodcastDocument,
  GetPodcastEpisodeBookmarksDocument,
  GetPodcastEpisodeBookmarksQueryVariables,
  GetPodcastEpisodeDocument,
  GetPodcastEpisodeQueryVariables,
  GetPodcastEpisodesByIdsDocument,
  GetPodcastEpisodesByIdsQueryVariables,
  GetPodcastQueryVariables,
  GetRecentlyPlayedDocument,
  GetRecentlyPlayedQueryVariables,
  GetRecommendationsDocument,
  GetRecommendationsQueryVariables,
  GetSimilarArtistsDocument,
  GetSimilarArtistsQueryVariables,
  GetSimilarTracksDocument,
  GetSimilarTracksQueryVariables,
  GetSmartTracklistDocument,
  GetSmartTracklistQueryVariables,
  GetTrackDocument,
  GetTrackMixDocument,
  GetTrackMixQueryVariables,
  GetTrackQueryVariables,
  GetUserChartsDocument,
  GetUserChartsQueryVariables,
  GetUserPlaylistsDocument,
  GetUserPlaylistsQueryVariables,
  MarkAsNotPlayedPodcastEpisodeDocument,
  MarkAsNotPlayedPodcastEpisodeMutationVariables,
  MarkAsPlayedPodcastEpisodeDocument,
  MarkAsPlayedPodcastEpisodeMutationVariables,
  MusicTogetherCreateGroupDocument,
  MusicTogetherCreateGroupMutationVariables,
  MusicTogetherGenerateGroupNameDocument,
  MusicTogetherGenerateGroupNameMutationVariables,
  MusicTogetherJoinGroupDocument,
  MusicTogetherJoinGroupMutationVariables,
  MusicTogetherLeaveGroupDocument,
  MusicTogetherLeaveGroupMutationVariables,
  MusicTogetherRefreshSuggestedTracklistDocument,
  MusicTogetherRefreshSuggestedTracklistMutationVariables,
  MusicTogetherUpdateGroupSettingsDocument,
  MusicTogetherUpdateGroupSettingsMutationVariables,
  RemoveAlbumFromFavoriteDocument,
  RemoveAlbumFromFavoriteMutationVariables,
  RemoveArtistFromFavoriteDocument,
  RemoveArtistFromFavoriteMutationVariables,
  RemoveAudiobookFromFavoriteDocument,
  RemoveAudiobookFromFavoriteMutationVariables,
  RemovePlaylistFromFavoriteDocument,
  RemovePlaylistFromFavoriteMutationVariables,
  RemovePodcastFromFavoriteDocument,
  RemovePodcastFromFavoriteMutationVariables,
  RemoveTrackFromFavoriteDocument,
  RemoveTrackFromFavoriteMutationVariables,
  RemoveTracksFromPlaylistDocument,
  RemoveTracksFromPlaylistMutationVariables,
  SearchDocument,
  SearchFlowsDocument,
  SearchFlowsQueryVariables,
  SearchQueryVariables,
  UnbookmarkPodcastEpisodeDocument,
  UnbookmarkPodcastEpisodeMutationVariables,
  UpdatePlaylistDocument,
  UpdatePlaylistMutationVariables,
} from "./definitions";
import { createDeezerClient } from "./graphql-client";
import { DeezerError } from "./errors";

const arl = process.env.DEEZER_ARL ??
  "2dd9cd96d9272cd665d73dcae22d9da7540bdd1df335926e3110bb75542dafc90fa6c553af53b01085fbcd583a4e5d2e6ee8589b871bd93db1b2f8c2d8167ec99c4a9e80b29bcb34b6985aabbd06966014049ae4ba95f83d8e2a9db8de89650e";

const auth = createDeezerClient(arl, {
  showLogs: false,
});

const client = new GraphQLClient("https://pipe.deezer.com/api", {
  fetch: auth.fetch,
  requestMiddleware: async (request) => {
    const headers = new Headers(request.headers);
    headers.set("Authorization", await auth.getAuthorizationHeader());
    headers.set("Accept-Language", "es-ES,es;q=0.9,en;q=0.8");
    return { ...request, headers };
  },
});

export const getAlbum = async (variables: GetAlbumQueryVariables) => {
  try {
    const { album } = await client.request(GetAlbumDocument, variables);
    return album;
  } catch (error) {
    throw new DeezerError("Error obteniendo el álbum");
  }
};

export const getArtist = async (variables: GetArtistQueryVariables) => {
  try {
    const { artist } = await client.request(GetArtistDocument, variables);
    return artist;
  } catch (error) {
    throw new DeezerError("Error obteniendo el artista");
  }
};

export const getArtistMix = async (variables: GetArtistMixQueryVariables) => {
  try {
    const { artistMix } = await client.request(GetArtistMixDocument, variables);
    return artistMix;
  } catch (error) {
    throw new DeezerError("Error obteniendo el mix de artistas");
  }
};

export const getAudiobook = async (variables: GetAudiobookQueryVariables) => {
  try {
    const { audiobook } = await client.request(GetAudiobookDocument, variables);
    return audiobook;
  } catch (error) {
    throw new DeezerError("Error obteniendo el audiolibro");
  }
};

export const getAudiobookChapter = async (
  variables: GetAudiobookChapterQueryVariables,
) => {
  try {
    const { audiobookChapter } = await client.request(
      GetAudiobookChapterDocument,
      variables,
    );
    return audiobookChapter;
  } catch (error) {
    throw new DeezerError("Error obteniendo el capítulo del audiolibro");
  }
};

export const getCharts = async (variables: GetChartsQueryVariables = {}) => {
  try {
    const { charts } = await client.request(GetChartsDocument, variables);
    return charts;
  } catch (error) {
    throw new DeezerError("Error obteniendo las listas de éxitos");
  }
};

export const getFavoriteAlbums = async (
  variables: GetFavoriteAlbumsQueryVariables = {},
) => {
  try {
    const { me } = await client.request(GetFavoriteAlbumsDocument, variables);
    return me;
  } catch (error) {
    throw new DeezerError("Error obteniendo los álbumes favoritos");
  }
};

export const getFavoriteArtists = async (
  variables: GetFavoriteArtistsQueryVariables = {},
) => {
  try {
    const { me } = await client.request(GetFavoriteArtistsDocument, variables);
    return me;
  } catch (error) {
    throw new DeezerError("Error obteniendo los artistas favoritos");
  }
};

export const getFavoriteAudiobooks = async (
  variables: GetFavoriteAudiobooksQueryVariables = {},
) => {
  try {
    const { me } = await client.request(
      GetFavoriteAudiobooksDocument,
      variables,
    );
    return me;
  } catch (error) {
    throw new DeezerError("Error obteniendo los audiolibros favoritos");
  }
};

export const getFavoritePlaylists = async (
  variables: GetFavoritePlaylistsQueryVariables = {},
) => {
  try {
    const { me } = await client.request(
      GetFavoritePlaylistsDocument,
      variables,
    );
    return me;
  } catch (error) {
    throw new DeezerError("Error obteniendo las playlists favoritas");
  }
};

export const getFavoritePodcasts = async (
  variables: GetFavoritePodcastsQueryVariables = {},
) => {
  try {
    const { me } = await client.request(GetFavoritePodcastsDocument, variables);
    return me;
  } catch (error) {
    throw new DeezerError("Error obteniendo los podcasts favoritos");
  }
};

export const getFavoriteTracks = async (
  variables: GetFavoriteTracksQueryVariables = {},
) => {
  try {
    const { me } = await client.request(GetFavoriteTracksDocument, variables);
    return me;
  } catch (error) {
    throw new DeezerError("Error obteniendo las canciones favoritas");
  }
};

export const getFlow = async (variables: GetFlowQueryVariables = {}) => {
  try {
    const { me } = await client.request(GetFlowDocument, variables);
    return me;
  } catch (error) {
    throw new DeezerError("Error obteniendo el Flow");
  }
};

export const getFlowBatch = async (
  variables: GetFlowBatchQueryVariables = {},
) => {
  try {
    const { me } = await client.request(GetFlowBatchDocument, variables);
    return me;
  } catch (error) {
    throw new DeezerError("Error obteniendo el Flow por lotes");
  }
};

export const getFlowConfigTracks = async (
  variables: GetFlowConfigTracksQueryVariables,
) => {
  try {
    const { flowConfig } = await client.request(
      GetFlowConfigTracksDocument,
      variables,
    );
    return flowConfig;
  } catch (error) {
    throw new DeezerError("Error obteniendo las pistas del Flow");
  }
};

export const getFlowConfigs = async (
  variables: GetFlowConfigsQueryVariables = {},
) => {
  try {
    const { me } = await client.request(GetFlowConfigsDocument, variables);
    return me;
  } catch (error) {
    throw new DeezerError("Error obteniendo la configuración de Flows");
  }
};

export const getLivestream = async (variables: GetLivestreamQueryVariables) => {
  try {
    const { livestream } = await client.request(
      GetLivestreamDocument,
      variables,
    );
    return livestream;
  } catch (error) {
    throw new DeezerError("Error obteniendo la transmisión en vivo");
  }
};

export const getMadeForMe = async (
  variables: GetMadeForMeQueryVariables = {},
) => {
  try {
    const { me } = await client.request(GetMadeForMeDocument, variables);
    return me;
  } catch (error) {
    throw new DeezerError("Error obteniendo las recomendaciones para ti");
  }
};

export const getMe = async (variables: GetMeQueryVariables = {}) => {
  try {
    const { me } = await client.request(GetMeDocument, variables);
    return me;
  } catch (error) {
    throw new DeezerError("Error obteniendo el usuario");
  }
};

export const getMusicTogetherAffinity = async (
  variables: GetMusicTogetherAffinityQueryVariables,
) => {
  try {
    const { musicTogetherAffinity } = await client.request(
      GetMusicTogetherAffinityDocument,
      variables,
    );
    return musicTogetherAffinity;
  } catch (error) {
    throw new DeezerError("Error obteniendo la afinidad de Music Together");
  }
};

export const getMusicTogetherGroup = async (
  variables: GetMusicTogetherGroupQueryVariables,
) => {
  try {
    const { musicTogetherGroup } = await client.request(
      GetMusicTogetherGroupDocument,
      variables,
    );
    return musicTogetherGroup;
  } catch (error) {
    throw new DeezerError("Error obteniendo el grupo de Music Together");
  }
};

export const getMusicTogetherGroups = async (
  variables: GetMusicTogetherGroupsQueryVariables = {},
) => {
  try {
    const { me } = await client.request(
      GetMusicTogetherGroupsDocument,
      variables,
    );
    return me;
  } catch (error) {
    throw new DeezerError("Error obteniendo los grupos de Music Together");
  }
};

export const getPersonalTracks = async (
  variables: GetPersonalTracksQueryVariables = {},
) => {
  try {
    const { me } = await client.request(GetPersonalTracksDocument, variables);
    return me;
  } catch (error) {
    throw new DeezerError("Error obteniendo las pistas personales");
  }
};

export const getPlaylist = async (variables: GetPlaylistQueryVariables) => {
  try {
    const { playlist } = await client.request(GetPlaylistDocument, variables);
    return playlist;
  } catch (error) {
    throw new DeezerError("Error obteniendo la playlist");
  }
};

export const getPodcast = async (variables: GetPodcastQueryVariables) => {
  try {
    const { podcast } = await client.request(GetPodcastDocument, variables);
    return podcast;
  } catch (error) {
    throw new DeezerError("Error obteniendo el podcast");
  }
};

export const getPodcastEpisode = async (
  variables: GetPodcastEpisodeQueryVariables,
) => {
  try {
    const { podcastEpisode } = await client.request(
      GetPodcastEpisodeDocument,
      variables,
    );
    return podcastEpisode;
  } catch (error) {
    throw new DeezerError("Error obteniendo el episodio del podcast");
  }
};

export const getPodcastEpisodeBookmarks = async (
  variables: GetPodcastEpisodeBookmarksQueryVariables = {},
) => {
  try {
    const { me } = await client.request(
      GetPodcastEpisodeBookmarksDocument,
      variables,
    );
    return me;
  } catch (error) {
    throw new DeezerError("Error obteniendo los marcadores de episodios");
  }
};

export const getPodcastEpisodesByIds = async (
  variables: GetPodcastEpisodesByIdsQueryVariables,
) => {
  try {
    const { podcastEpisodesByIds } = await client.request(
      GetPodcastEpisodesByIdsDocument,
      variables,
    );
    return podcastEpisodesByIds;
  } catch (error) {
    throw new DeezerError("Error obteniendo los episodios");
  }
};

export const getRecentlyPlayed = async (
  variables: GetRecentlyPlayedQueryVariables = {},
) => {
  try {
    const { me } = await client.request(GetRecentlyPlayedDocument, variables);
    return me;
  } catch (error) {
    throw new DeezerError("Error obteniendo lo reproducido recientemente");
  }
};

export const getRecommendations = async (
  variables: GetRecommendationsQueryVariables = {},
) => {
  try {
    const { me } = await client.request(GetRecommendationsDocument, variables);
    return me;
  } catch (error) {
    throw new DeezerError("Error obteniendo las recomendaciones");
  }
};

export const getSimilarArtists = async (
  variables: GetSimilarArtistsQueryVariables,
) => {
  try {
    const { artist } = await client.request(
      GetSimilarArtistsDocument,
      variables,
    );
    return artist;
  } catch (error) {
    throw new DeezerError("Error obteniendo los artistas similares");
  }
};

export const getSimilarTracks = async (
  variables: GetSimilarTracksQueryVariables,
) => {
  try {
    const { track } = await client.request(GetSimilarTracksDocument, variables);
    return track;
  } catch (error) {
    throw new DeezerError("Error obteniendo las canciones similares");
  }
};

export const getSmartTracklist = async (
  variables: GetSmartTracklistQueryVariables,
) => {
  try {
    const { smartTracklist } = await client.request(
      GetSmartTracklistDocument,
      variables,
    );
    return smartTracklist;
  } catch (error) {
    throw new DeezerError("Error obteniendo la lista inteligente");
  }
};

export const getTrack = async (variables: GetTrackQueryVariables) => {
  try {
    const { track } = await client.request(GetTrackDocument, variables);
    return track;
  } catch (error) {
    throw new DeezerError("Error obteniendo la canción");
  }
};

export const getTrackMix = async (variables: GetTrackMixQueryVariables) => {
  try {
    const { trackMix } = await client.request(GetTrackMixDocument, variables);
    return trackMix;
  } catch (error) {
    throw new DeezerError("Error obteniendo el mix de la canción");
  }
};

export const getUserCharts = async (
  variables: GetUserChartsQueryVariables = {},
) => {
  try {
    const { me } = await client.request(GetUserChartsDocument, variables);
    return me;
  } catch (error) {
    throw new DeezerError("Error obteniendo las listas del usuario");
  }
};

export const getUserPlaylists = async (
  variables: GetUserPlaylistsQueryVariables = {},
) => {
  try {
    const { me } = await client.request(GetUserPlaylistsDocument, variables);
    return me;
  } catch (error) {
    throw new DeezerError("Error obteniendo las playlists del usuario");
  }
};

export const search = async (variables: SearchQueryVariables) => {
  try {
    const { search } = await client.request(SearchDocument, variables);
    return search;
  } catch (error) {
    throw new DeezerError("Error en la búsqueda");
  }
};

export const searchFlows = async (
  variables: SearchFlowsQueryVariables = {},
) => {
  try {
    const { search } = await client.request(SearchFlowsDocument, variables);
    return search;
  } catch (error) {
    throw new DeezerError("Error buscando los Flows");
  }
};

export const addArtistToFavorite = async (
  variables: AddArtistToFavoriteMutationVariables,
) => {
  try {
    const { addArtistToFavorite } = await client.request(
      AddArtistToFavoriteDocument,
      variables,
    );
    return addArtistToFavorite;
  } catch (error) {
    throw new DeezerError("Error agregando el artista a favoritos");
  }
};

export const removeArtistFromFavorite = async (
  variables: RemoveArtistFromFavoriteMutationVariables,
) => {
  try {
    const { removeArtistFromFavorite } = await client.request(
      RemoveArtistFromFavoriteDocument,
      variables,
    );
    return removeArtistFromFavorite;
  } catch (error) {
    throw new DeezerError("Error eliminando el artista de favoritos");
  }
};

export const addAlbumToFavorite = async (
  variables: AddAlbumToFavoriteMutationVariables,
) => {
  try {
    const { addAlbumToFavorite } = await client.request(
      AddAlbumToFavoriteDocument,
      variables,
    );
    return addAlbumToFavorite;
  } catch (error) {
    throw new DeezerError("Error agregando el álbum a favoritos");
  }
};

export const removeAlbumFromFavorite = async (
  variables: RemoveAlbumFromFavoriteMutationVariables,
) => {
  try {
    const { removeAlbumFromFavorite } = await client.request(
      RemoveAlbumFromFavoriteDocument,
      variables,
    );
    return removeAlbumFromFavorite;
  } catch (error) {
    throw new DeezerError("Error eliminando el álbum de favoritos");
  }
};

export const addTrackToFavorite = async (
  variables: AddTrackToFavoriteMutationVariables,
) => {
  try {
    const { addTrackToFavorite } = await client.request(
      AddTrackToFavoriteDocument,
      variables,
    );
    return addTrackToFavorite;
  } catch (error) {
    throw new DeezerError("Error agregando la canción a favoritos");
  }
};

export const removeTrackFromFavorite = async (
  variables: RemoveTrackFromFavoriteMutationVariables,
) => {
  try {
    const { removeTrackFromFavorite } = await client.request(
      RemoveTrackFromFavoriteDocument,
      variables,
    );
    return removeTrackFromFavorite;
  } catch (error) {
    throw new DeezerError("Error eliminando la canción de favoritos");
  }
};

export const addPlaylistToFavorite = async (
  variables: AddPlaylistToFavoriteMutationVariables,
) => {
  try {
    const { addPlaylistToFavorite } = await client.request(
      AddPlaylistToFavoriteDocument,
      variables,
    );
    return addPlaylistToFavorite;
  } catch (error) {
    throw new DeezerError("Error agregando la playlist a favoritos");
  }
};

export const removePlaylistFromFavorite = async (
  variables: RemovePlaylistFromFavoriteMutationVariables,
) => {
  try {
    const { removePlaylistFromFavorite } = await client.request(
      RemovePlaylistFromFavoriteDocument,
      variables,
    );
    return removePlaylistFromFavorite;
  } catch (error) {
    throw new DeezerError("Error eliminando la playlist de favoritos");
  }
};

export const addPodcastToFavorite = async (
  variables: AddPodcastToFavoriteMutationVariables,
) => {
  try {
    const { addPodcastToFavorite } = await client.request(
      AddPodcastToFavoriteDocument,
      variables,
    );
    return addPodcastToFavorite;
  } catch (error) {
    throw new DeezerError("Error agregando el podcast a favoritos");
  }
};

export const removePodcastFromFavorite = async (
  variables: RemovePodcastFromFavoriteMutationVariables,
) => {
  try {
    const { removePodcastFromFavorite } = await client.request(
      RemovePodcastFromFavoriteDocument,
      variables,
    );
    return removePodcastFromFavorite;
  } catch (error) {
    throw new DeezerError("Error eliminando el podcast de favoritos");
  }
};

export const bookmarkPodcastEpisode = async (
  variables: BookmarkPodcastEpisodeMutationVariables,
) => {
  try {
    const { bookmarkPodcastEpisode } = await client.request(
      BookmarkPodcastEpisodeDocument,
      variables,
    );
    return bookmarkPodcastEpisode;
  } catch (error) {
    throw new DeezerError("Error marcando el episodio");
  }
};

export const unbookmarkPodcastEpisode = async (
  variables: UnbookmarkPodcastEpisodeMutationVariables,
) => {
  try {
    const { unbookmarkPodcastEpisode } = await client.request(
      UnbookmarkPodcastEpisodeDocument,
      variables,
    );
    return unbookmarkPodcastEpisode;
  } catch (error) {
    throw new DeezerError("Error desmarcando el episodio");
  }
};

export const markAsPlayedPodcastEpisode = async (
  variables: MarkAsPlayedPodcastEpisodeMutationVariables,
) => {
  try {
    const { markAsPlayedPodcastEpisode } = await client.request(
      MarkAsPlayedPodcastEpisodeDocument,
      variables,
    );
    return markAsPlayedPodcastEpisode;
  } catch (error) {
    throw new DeezerError("Error marcando el episodio como reproducido");
  }
};

export const markAsNotPlayedPodcastEpisode = async (
  variables: MarkAsNotPlayedPodcastEpisodeMutationVariables,
) => {
  try {
    const { markAsNotPlayedPodcastEpisode } = await client.request(
      MarkAsNotPlayedPodcastEpisodeDocument,
      variables,
    );
    return markAsNotPlayedPodcastEpisode;
  } catch (error) {
    throw new DeezerError("Error marcando el episodio como no reproducido");
  }
};

export const addAudiobookToFavorite = async (
  variables: AddAudiobookToFavoriteMutationVariables,
) => {
  try {
    const { addAudiobookToFavorite } = await client.request(
      AddAudiobookToFavoriteDocument,
      variables,
    );
    return addAudiobookToFavorite;
  } catch (error) {
    throw new DeezerError("Error agregando el audiolibro a favoritos");
  }
};

export const removeAudiobookFromFavorite = async (
  variables: RemoveAudiobookFromFavoriteMutationVariables,
) => {
  try {
    const { removeAudiobookFromFavorite } = await client.request(
      RemoveAudiobookFromFavoriteDocument,
      variables,
    );
    return removeAudiobookFromFavorite;
  } catch (error) {
    throw new DeezerError("Error eliminando el audiolibro de favoritos");
  }
};

export const musicTogetherCreateGroup = async (
  variables: MusicTogetherCreateGroupMutationVariables,
) => {
  try {
    const { musicTogetherCreateGroup } = await client.request(
      MusicTogetherCreateGroupDocument,
      variables,
    );
    return musicTogetherCreateGroup;
  } catch (error) {
    throw new DeezerError("Error creando el grupo de Music Together");
  }
};

export const musicTogetherJoinGroup = async (
  variables: MusicTogetherJoinGroupMutationVariables,
) => {
  try {
    const { musicTogetherJoinGroup } = await client.request(
      MusicTogetherJoinGroupDocument,
      variables,
    );
    return musicTogetherJoinGroup;
  } catch (error) {
    throw new DeezerError("Error uniéndose al grupo de Music Together");
  }
};

export const musicTogetherLeaveGroup = async (
  variables: MusicTogetherLeaveGroupMutationVariables,
) => {
  try {
    const { musicTogetherLeaveGroup } = await client.request(
      MusicTogetherLeaveGroupDocument,
      variables,
    );
    return musicTogetherLeaveGroup;
  } catch (error) {
    throw new DeezerError("Error saliendo del grupo de Music Together");
  }
};

export const musicTogetherRefreshSuggestedTracklist = async (
  variables: MusicTogetherRefreshSuggestedTracklistMutationVariables,
) => {
  try {
    const { musicTogetherRefreshSuggestedTracklist } = await client.request(
      MusicTogetherRefreshSuggestedTracklistDocument,
      variables,
    );
    return musicTogetherRefreshSuggestedTracklist;
  } catch (error) {
    throw new DeezerError("Error refrescando la lista sugerida");
  }
};

export const musicTogetherUpdateGroupSettings = async (
  variables: MusicTogetherUpdateGroupSettingsMutationVariables,
) => {
  try {
    const { musicTogetherUpdateGroupSettings } = await client.request(
      MusicTogetherUpdateGroupSettingsDocument,
      variables,
    );
    return musicTogetherUpdateGroupSettings;
  } catch (error) {
    throw new DeezerError("Error actualizando la configuración del grupo");
  }
};

export const musicTogetherGenerateGroupName = async (
  variables: MusicTogetherGenerateGroupNameMutationVariables = {},
) => {
  try {
    const { musicTogetherGenerateGroupName } = await client.request(
      MusicTogetherGenerateGroupNameDocument,
      variables,
    );
    return musicTogetherGenerateGroupName;
  } catch (error) {
    throw new DeezerError("Error generando el nombre del grupo");
  }
};

export const createPlaylist = async (
  variables: CreatePlaylistMutationVariables,
) => {
  try {
    const { createPlaylist } = await client.request(
      CreatePlaylistDocument,
      variables,
    );
    return createPlaylist;
  } catch (error) {
    throw new DeezerError("Error creando la playlist");
  }
};

export const updatePlaylist = async (
  variables: UpdatePlaylistMutationVariables,
) => {
  try {
    const { updatePlaylist } = await client.request(
      UpdatePlaylistDocument,
      variables,
    );
    return updatePlaylist;
  } catch (error) {
    throw new DeezerError("Error actualizando la playlist");
  }
};

export const deletePlaylist = async (
  variables: DeletePlaylistMutationVariables,
) => {
  try {
    const { deletePlaylist } = await client.request(
      DeletePlaylistDocument,
      variables,
    );
    return deletePlaylist;
  } catch (error) {
    throw new DeezerError("Error eliminando la playlist");
  }
};

export const addTracksToPlaylist = async (
  variables: AddTracksToPlaylistMutationVariables,
) => {
  try {
    const { addTracksToPlaylist } = await client.request(
      AddTracksToPlaylistDocument,
      variables,
    );
    return addTracksToPlaylist;
  } catch (error) {
    throw new DeezerError("Error agregando canciones a la playlist");
  }
};

export const removeTracksFromPlaylist = async (
  variables: RemoveTracksFromPlaylistMutationVariables,
) => {
  try {
    const { removeTracksFromPlaylist } = await client.request(
      RemoveTracksFromPlaylistDocument,
      variables,
    );
    return removeTracksFromPlaylist;
  } catch (error) {
    throw new DeezerError("Error eliminando canciones de la playlist");
  }
};

