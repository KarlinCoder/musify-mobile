interface Track {
  id: string;
  title: string;
  album: {
    id: string;
    name: string;
    cover: string;
  };
  artists: Artist[];
  duration: number;
  explicit_lyrics: boolean;
}

interface Album {
  id: string;
  title: string;
  cover: string | null;
  artists: Artist[];
  explicit_lyrics: boolean;
  type: "EP" | "SINGLE" | "ALBUM";
}

interface Playlist {
  id: string;
  title: string;
  picture: string | null;
  nb_tracks: number;
  is_official: boolean;
  description: string | null;
}

interface Artist {
  id: string;
  name: string;
  picture: string | null;
}

interface Genre {
  id: string;
  name: string;
  picture: string;
}

interface Popular {
  tracks: Track[];
  albums: Album[];
  artists: Artist[];
  playlists: Playlist[];
}

interface MFLyricLine {
  timestamp: string;
  text: string;
  milliseconds: number;
  duration: number;
}

interface MFTrack {
  id: string;
  title: string;
  artists: {
    id: string;
    name: string;
    picture?: string;
  }[];
  image_url: string;
  duration: number;
  explicit_lyrics: boolean;
}

interface MFArtist {
  id: string;
  name: string;
  image_url: string | null;
}

interface MFAlbum {
  id: string;
  title: string;
  image_url: string | null;
  artist: {
    id: string;
    name: string;
    image_url?: string;
  };
  explicit_lyrics: boolean;
  record_type: string;
}

interface MFPlaylist {
  id: string;
  title: string;
  image_url: string | null;
  nb_tracks: number;
  is_official: boolean;
}

interface MFPopular {
  tracks: MFTrack[];
  albums: MFAlbum[];
  artists: MFArtist[];
  playlists: MFPlaylist[];
}

interface MFTrackPage extends MFTrack {
  avg_color: string;
  lyrics: MFLyricLine[];
  sizes: {
    MP3_128: number;
    MP3_320: number;
    FLAC: number;
  };
}

interface MFArtistPage extends MFArtist {
  nb_albums: number;
  bio_html: string;
  avg_color: string;
}

interface MFAlbumPage extends MFAlbum {
  duration: number;
  label: string;
  copyright: string;
  release_date: string;
  nb_tracks: number;
  avg_color: string;
  tracks: MFTrack[];
}

interface MFPlaylistPage extends MFPlaylist {
  add_date: Date;
  mod_date: Date;
  duration: number;
  description: string;
  avg_color: string;
  tracks: MFTrack[];
}

interface Recomendations {
  artists: Artist[];
  artistsPlaylists: Playlist[];
  tracks: Track[];
  newReleases: Album[];
  playlists: Playlist[];
}
