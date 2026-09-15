interface MFTrack {
  id: string;
  title: string;
  artists: {
    id: string;
    name: string;
  }[];
  image_url: string;
  duration_ms: number;
  explicit_lyrics: boolean;
}

interface MFLyricLine {
  timestamp: string;
  text: string;
  milliseconds: number;
  duration: number;
}

interface MFArtist {
  id: string;
  name: string;
  image_url: string;
}

interface MFAlbum {
  id: string;
  title: string;
  image_url: string;
  artist: MFArtist;
  explicit_lyrics: boolean;
  record_type: string;
}

interface MFPlaylist {
  id: string;
  title: string;
  image_url: string;
  nb_tracks: number;
  is_official: boolean;
}

interface MFTrackPage extends MFTrack {
  lyrics: MFLyricLine[];
  avg_color: string;
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

interface MFPopular {
  tracks: MFTrack[];
  albums: MFAlbum[];
  artists: MFArtist[];
  playlists: MFPlaylist[];
}
