import { FontAwesome6 } from "@expo/vector-icons";
import dz from "deezer-sdk";
import { useState, type ReactNode } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

interface SdkFunction {
  name: string;
  kind: "query" | "mutation";
  fields: string[];
  example?: string;
  run: (variables: any) => Promise<any>;
}

const SDK_FUNCTIONS: SdkFunction[] = [
  { kind: "query", name: "search", fields: ["query"], run: dz.search },
  {
    kind: "query",
    name: "searchFlows",
    fields: ["query"],
    run: dz.searchFlows,
  },
  { kind: "query", name: "getTrack", fields: ["trackId"], run: dz.getTrack },
  {
    kind: "query",
    name: "getTrackMix",
    fields: ["trackIds"],
    run: dz.getTrackMix,
  },
  { kind: "query", name: "getAlbum", fields: ["albumId"], run: dz.getAlbum },
  { kind: "query", name: "getArtist", fields: ["artistId"], run: dz.getArtist },
  {
    kind: "query",
    name: "getArtistMix",
    fields: ["artistIds"],
    run: dz.getArtistMix,
  },
  {
    kind: "query",
    name: "getPlaylist",
    fields: ["playlistId"],
    run: dz.getPlaylist,
  },
  {
    kind: "query",
    name: "getPodcast",
    fields: ["podcastId"],
    run: dz.getPodcast,
  },
  {
    kind: "query",
    name: "getPodcastEpisode",
    fields: ["podcastEpisodeId"],
    run: dz.getPodcastEpisode,
  },
  {
    kind: "query",
    name: "getPodcastEpisodesByIds",
    fields: ["ids"],
    run: dz.getPodcastEpisodesByIds,
  },
  {
    kind: "query",
    name: "getPodcastEpisodeBookmarks",
    fields: [],
    run: dz.getPodcastEpisodeBookmarks,
  },
  {
    kind: "query",
    name: "getAudiobook",
    fields: ["audiobookId"],
    run: dz.getAudiobook,
  },
  {
    kind: "query",
    name: "getAudiobookChapter",
    fields: ["audiobookChapterId"],
    run: dz.getAudiobookChapter,
  },
  {
    kind: "query",
    name: "getSimilarArtists",
    fields: ["artistId"],
    run: dz.getSimilarArtists,
  },
  {
    kind: "query",
    name: "getSimilarTracks",
    fields: ["trackId"],
    run: dz.getSimilarTracks,
  },
  {
    kind: "query",
    name: "getSmartTracklist",
    fields: ["smartTracklistId"],
    run: dz.getSmartTracklist,
  },
  {
    kind: "query",
    name: "getLivestream",
    fields: ["livestreamId"],
    run: dz.getLivestream,
  },
  {
    kind: "query",
    name: "getFlowConfigTracks",
    fields: ["flowConfigId"],
    run: dz.getFlowConfigTracks,
  },
  { kind: "query", name: "getCharts", fields: [], run: dz.getCharts },
  { kind: "query", name: "getFlow", fields: [], run: dz.getFlow },
  { kind: "query", name: "getFlowBatch", fields: [], run: dz.getFlowBatch },
  { kind: "query", name: "getFlowConfigs", fields: [], run: dz.getFlowConfigs },
  {
    kind: "query",
    name: "getFavoriteTracks",
    fields: [],
    run: dz.getFavoriteTracks,
  },
  {
    kind: "query",
    name: "getFavoriteAlbums",
    fields: [],
    run: dz.getFavoriteAlbums,
  },
  {
    kind: "query",
    name: "getFavoriteArtists",
    fields: [],
    run: dz.getFavoriteArtists,
  },
  {
    kind: "query",
    name: "getFavoritePlaylists",
    fields: [],
    run: dz.getFavoritePlaylists,
  },
  {
    kind: "query",
    name: "getFavoritePodcasts",
    fields: [],
    run: dz.getFavoritePodcasts,
  },
  {
    kind: "query",
    name: "getFavoriteAudiobooks",
    fields: [],
    run: dz.getFavoriteAudiobooks,
  },
  { kind: "query", name: "getMadeForMe", fields: [], run: dz.getMadeForMe },
  {
    kind: "query",
    name: "getRecentlyPlayed",
    fields: [],
    run: dz.getRecentlyPlayed,
  },
  {
    kind: "query",
    name: "getRecommendations",
    fields: [],
    run: dz.getRecommendations,
  },
  { kind: "query", name: "getUserCharts", fields: [], run: dz.getUserCharts },
  {
    kind: "query",
    name: "getUserPlaylists",
    fields: [],
    run: dz.getUserPlaylists,
  },
  {
    kind: "query",
    name: "getPersonalTracks",
    fields: [],
    run: dz.getPersonalTracks,
  },
  { kind: "query", name: "getMe", fields: [], run: dz.getMe },
  {
    kind: "query",
    name: "getMusicTogetherAffinity",
    fields: ["groupId", "memberId"],
    example: '{"groupId":"1","memberId":"1"}',
    run: dz.getMusicTogetherAffinity,
  },
  {
    kind: "query",
    name: "getMusicTogetherGroup",
    fields: ["groupId"],
    run: dz.getMusicTogetherGroup,
  },
  {
    kind: "query",
    name: "getMusicTogetherGroups",
    fields: [],
    run: dz.getMusicTogetherGroups,
  },
  {
    kind: "mutation",
    name: "addArtistToFavorite",
    fields: ["artistId"],
    run: dz.addArtistToFavorite,
  },
  {
    kind: "mutation",
    name: "removeArtistFromFavorite",
    fields: ["artistId"],
    run: dz.removeArtistFromFavorite,
  },
  {
    kind: "mutation",
    name: "addAlbumToFavorite",
    fields: ["albumId"],
    run: dz.addAlbumToFavorite,
  },
  {
    kind: "mutation",
    name: "removeAlbumFromFavorite",
    fields: ["albumId"],
    run: dz.removeAlbumFromFavorite,
  },
  {
    kind: "mutation",
    name: "addTrackToFavorite",
    fields: ["trackId"],
    run: dz.addTrackToFavorite,
  },
  {
    kind: "mutation",
    name: "removeTrackFromFavorite",
    fields: ["trackId"],
    run: dz.removeTrackFromFavorite,
  },
  {
    kind: "mutation",
    name: "addPlaylistToFavorite",
    fields: ["playlistId"],
    run: dz.addPlaylistToFavorite,
  },
  {
    kind: "mutation",
    name: "removePlaylistFromFavorite",
    fields: ["playlistId"],
    run: dz.removePlaylistFromFavorite,
  },
  {
    kind: "mutation",
    name: "addPodcastToFavorite",
    fields: ["podcastId"],
    run: dz.addPodcastToFavorite,
  },
  {
    kind: "mutation",
    name: "removePodcastFromFavorite",
    fields: ["podcastId"],
    run: dz.removePodcastFromFavorite,
  },
  {
    kind: "mutation",
    name: "bookmarkPodcastEpisode",
    fields: ["episodeId", "offset"],
    example: '{"episodeId":"123456","offset":30}',
    run: dz.bookmarkPodcastEpisode,
  },
  {
    kind: "mutation",
    name: "unbookmarkPodcastEpisode",
    fields: ["episodeId"],
    run: dz.unbookmarkPodcastEpisode,
  },
  {
    kind: "mutation",
    name: "markAsPlayedPodcastEpisode",
    fields: ["episodeId"],
    run: dz.markAsPlayedPodcastEpisode,
  },
  {
    kind: "mutation",
    name: "markAsNotPlayedPodcastEpisode",
    fields: ["episodeId"],
    run: dz.markAsNotPlayedPodcastEpisode,
  },
  {
    kind: "mutation",
    name: "addAudiobookToFavorite",
    fields: ["audiobookId"],
    run: dz.addAudiobookToFavorite,
  },
  {
    kind: "mutation",
    name: "removeAudiobookFromFavorite",
    fields: ["audiobookId"],
    run: dz.removeAudiobookFromFavorite,
  },
  {
    kind: "mutation",
    name: "musicTogetherCreateGroup",
    fields: ["name"],
    run: dz.musicTogetherCreateGroup,
  },
  {
    kind: "mutation",
    name: "musicTogetherJoinGroup",
    fields: ["groupId"],
    run: dz.musicTogetherJoinGroup,
  },
  {
    kind: "mutation",
    name: "musicTogetherLeaveGroup",
    fields: ["groupId"],
    run: dz.musicTogetherLeaveGroup,
  },
  {
    kind: "mutation",
    name: "musicTogetherRefreshSuggestedTracklist",
    fields: ["groupId"],
    run: dz.musicTogetherRefreshSuggestedTracklist,
  },
  {
    kind: "mutation",
    name: "musicTogetherUpdateGroupSettings",
    fields: ["groupId"],
    run: dz.musicTogetherUpdateGroupSettings,
  },
  {
    kind: "mutation",
    name: "musicTogetherGenerateGroupName",
    fields: [],
    run: dz.musicTogetherGenerateGroupName,
  },
  {
    kind: "mutation",
    name: "createPlaylist",
    fields: ["title"],
    run: dz.createPlaylist,
  },
  {
    kind: "mutation",
    name: "updatePlaylist",
    fields: ["playlistId"],
    run: dz.updatePlaylist,
  },
  {
    kind: "mutation",
    name: "deletePlaylist",
    fields: ["playlistId"],
    run: dz.deletePlaylist,
  },
  {
    kind: "mutation",
    name: "addTracksToPlaylist",
    fields: ["playlistId", "trackIds"],
    example: '{"playlistId":"1234","trackIds":["3135556"]}',
    run: dz.addTracksToPlaylist,
  },
  {
    kind: "mutation",
    name: "removeTracksFromPlaylist",
    fields: ["playlistId", "trackIds"],
    example: '{"playlistId":"1234","trackIds":["3135556"]}',
    run: dz.removeTracksFromPlaylist,
  },
];

const JSON_COLORS = {
  key: "#9CDCFE",
  string: "#CE9178",
  literal: "#569CD6",
  number: "#B5CEA8",
  plain: "#c9c9c9",
};

function highlightJson(json: string): ReactNode[] {
  const tokenRegex =
    /("(?:\\u[0-9a-fA-F]{4}|\\.|[^"\\])*")(\s*:)?|\b(true|false|null)\b|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g;

  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(json)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(
        <Text key={key++} style={{ color: JSON_COLORS.plain }}>
          {json.slice(lastIndex, match.index)}
        </Text>,
      );
    }
    if (match[1]) {
      const isKey = Boolean(match[2]);
      nodes.push(
        <Text
          key={key++}
          style={{ color: isKey ? JSON_COLORS.key : JSON_COLORS.string }}
        >
          {match[1]}
        </Text>,
      );
      if (match[2]) {
        nodes.push(
          <Text key={key++} style={{ color: JSON_COLORS.plain }}>
            {match[2]}
          </Text>,
        );
      }
    } else if (match[3]) {
      nodes.push(
        <Text key={key++} style={{ color: JSON_COLORS.literal }}>
          {match[3]}
        </Text>,
      );
    } else if (match[4]) {
      nodes.push(
        <Text key={key++} style={{ color: JSON_COLORS.number }}>
          {match[4]}
        </Text>,
      );
    }
    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < json.length) {
    nodes.push(
      <Text key={key++} style={{ color: JSON_COLORS.plain }}>
        {json.slice(lastIndex)}
      </Text>,
    );
  }

  return nodes;
}

const MAX_JSON_CHARS = 8000;

function buildVariables(
  fn: SdkFunction,
  input: string,
): Record<string, unknown> {
  const raw = input.trim();

  if (!raw) {
    if (fn.fields.length === 0) return {};
    throw new Error(`Esta función requiere: ${fn.fields.join(", ")}`);
  }

  if (raw.startsWith("{")) return JSON.parse(raw);

  if (fn.fields.length === 0) {
    throw new Error(
      "Esta función no usa variables simples. Pasa un objeto JSON.",
    );
  }

  if (fn.fields.length > 1) {
    throw new Error(
      `Esta función necesita varias variables (${fn.fields.join(", ")}). Usa JSON, ej: ${fn.example}`,
    );
  }

  const [field] = fn.fields;
  const isList = /Ids$/.test(field) || field === "ids";
  const value = isList
    ? raw
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean)
    : raw;

  return { [field]: value };
}

export default function SdkTestScreen() {
  const [fn, setFn] = useState<SdkFunction>(SDK_FUNCTIONS[0]);
  const [input, setInput] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<{
    ok: boolean;
    text: string;
    ms: number;
  } | null>(null);

  const selectFunction = (item: SdkFunction) => {
    setFn(item);
    setInput(item.example ?? "");
    setPickerOpen(false);
  };

  const execute = async () => {
    setRunning(true);
    setResult(null);

    const started = Date.now();
    try {
      const variables = buildVariables(fn, input);
      const data = await fn.run(variables);
      const json =
        data === undefined ? "undefined" : JSON.stringify(data, null, 2);
      setResult({
        ok: true,
        text:
          json.length > MAX_JSON_CHARS
            ? `${json.slice(0, MAX_JSON_CHARS)}\n… (truncado)`
            : json,
        ms: Date.now() - started,
      });

      console.log({ result: data });
    } catch (error) {
      setResult({
        ok: false,
        text: error instanceof Error ? error.message : String(error),
        ms: Date.now() - started,
      });
    } finally {
      setRunning(false);
    }
  };

  const placeholder = (() => {
    if (fn.fields.length === 0) return "Sin variables (opcional: objeto JSON)";
    if (fn.fields.length > 1) return `JSON, ej: ${fn.example ?? "{}"}`;
    const [field] = fn.fields;
    const isList = /Ids$/.test(field) || field === "ids";
    return isList
      ? `IDs separados por coma (ej: 3135556, 302127)`
      : `Valor para ${field} (o objeto JSON)`;
  })();

  const renderPickerItem = (item: SdkFunction) => {
    const active = item.name === fn.name;
    return (
      <Pressable
        key={item.name}
        onPress={() => selectFunction(item)}
        className={`rounded-lg px-3 py-2.5 ${active ? "bg-primary/25" : "active:bg-white/5"}`}
      >
        <Text
          className={`font-monospace text-sm ${active ? "text-primary" : "text-text"}`}
        >
          {item.name}
        </Text>
        <Text className="text-[10px] text-text-muted">
          {item.fields.length ? item.fields.join(", ") : "sin variables"}
        </Text>
      </Pressable>
    );
  };

  return (
    <View className="flex-1 bg-neutral-900">
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-3 p-4 pb-10"
        keyboardShouldPersistTaps="handled"
      >
        <Text className="font-title text-2xl text-text">Deezer SDK</Text>
        <Text className="font-text text-sm text-text-muted">
          Ejecuta cualquier función del SDK. La respuesta se muestra como JSON
          coloreado junto con el tiempo de la petición.
        </Text>

        <Pressable
          onPress={() => setPickerOpen(true)}
          className="flex-row items-center justify-between rounded-lg border border-white/10 bg-background-light px-4 py-3 active:opacity-80"
        >
          <View className="mr-2 flex-1">
            <Text className="font-monospace text-sm text-text">{fn.name}</Text>
            <Text className="text-[10px] text-text-muted">
              {fn.kind === "query" ? "query" : "mutation"} ·{" "}
              {fn.fields.length ? fn.fields.join(", ") : "sin variables"}
            </Text>
          </View>
          <FontAwesome6 name="chevron-down" size={14} color="#b3b3b3" />
        </Pressable>

        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder={placeholder}
          placeholderTextColor="#555555"
          autoCapitalize="none"
          autoCorrect={false}
          multiline
          numberOfLines={3}
          className="min-h-[72px] rounded-lg border border-white/10 bg-background-light px-3 py-3 font-monospace text-sm text-text"
        />

        <Pressable
          onPress={execute}
          disabled={running}
          className="flex-row items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 active:opacity-80 disabled:opacity-50"
        >
          {running && <ActivityIndicator size="small" color="#ffffff" />}
          <FontAwesome6 name="bolt" size={14} color="#ffffff" />
          <Text className="font-subtitle text-base text-white">
            {running ? "Ejecutando..." : "Ejecutar"}
          </Text>
        </Pressable>

        {result && (
          <View className="gap-1.5">
            <Text
              className={`font-monospace text-xs ${result.ok ? "text-[#4ade80]" : "text-[#f87171]"}`}
            >
              {result.ok ? "✓ OK" : "✗ Error"} · {result.ms} ms
            </Text>
            <View className="rounded-lg border border-white/10 bg-black/60 p-3">
              {result.ok ? (
                <View>
                  {result.text.split("\n").map((line, index) => (
                    <Text
                      key={index}
                      selectable
                      className="font-monospace text-[11px] leading-4 text-[#c9c9c9]"
                    >
                      {line ? highlightJson(line) : " "}
                    </Text>
                  ))}
                </View>
              ) : (
                <Text className="font-monospace text-[11px] leading-4 text-[#f87171]">
                  {result.text}
                </Text>
              )}
            </View>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={pickerOpen}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setPickerOpen(false)}
      >
        <View className="flex-1 justify-center bg-black/70 px-5">
          <View className="max-h-[75%] overflow-hidden rounded-2xl border border-white/10 bg-background-light">
            <View className="flex-row items-center justify-between border-b border-white/10 px-4 py-3">
              <Text className="font-subtitle text-base text-text">
                Elegir función
              </Text>
              <Pressable
                onPress={() => setPickerOpen(false)}
                className="rounded-full p-2 active:bg-white/10"
              >
                <FontAwesome6 name="xmark" size={16} color="#dedede" />
              </Pressable>
            </View>
            <View className="size-30  bg-blue-50"></View>
            <ScrollView className="px-2 py-2">
              <Text className="px-3 py-2 font-subtitle text-[10px] uppercase text-text-muted">
                Consultas
              </Text>
              {SDK_FUNCTIONS.filter((item) => item.kind === "query").map(
                renderPickerItem,
              )}
              <Text className="px-3 py-2 pt-4 font-subtitle text-[10px] uppercase text-text-muted">
                Mutaciones
              </Text>
              {SDK_FUNCTIONS.filter((item) => item.kind === "mutation").map(
                renderPickerItem,
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
