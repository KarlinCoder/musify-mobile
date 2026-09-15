import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { searchTracks } from "../services/deezer.service";

import searchquery from "../graphql/search.graphql";
import { print } from "graphql";

//

export default function TestScreen() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MFTrack[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function search() {
    alert(print(searchquery) ?? "");
    console.log(print(searchquery) ?? "");

    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await searchTracks(query);

      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {}, []);

  return (
    <View className="flex-1 gap-4 px-4 bg-black pt-14">
      <Text className="text-2xl text-neutral-100 font-primary">
        Test searchTracks
      </Text>

      <View className="flex-row items-center gap-2">
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Buscar canciones..."
          placeholderTextColor="#fff8"
          returnKeyType="search"
          onSubmitEditing={search}
          className="flex-1 py-3 rounded-lg px-9 bg-neutral-900 text-neutral-100"
        />
        <Pressable
          onPress={search}
          className="p-3 rounded-lg bg-red-500/40 active:bg-white/70"
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Ionicons name="search" size={20} color="#fff" />
          )}
        </Pressable>
      </View>

      {error ? (
        <View className="p-3 border rounded-lg bg-red-500/20 border-red-500/40">
          <Text className="text-red-400 font-primary">Error</Text>
          <Text className="mt-1 text-xs text-red-300">{error}</Text>
        </View>
      ) : null}

      <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
        {result !== null ? (
          <View className="p-4 rounded-lg bg-neutral-900">
            <Text className="mb-2 text-neutral-100 font-primary">
              Respuesta JSON
            </Text>
            <Text className="text-xs text-neutral-400" selectable>
              {JSON.stringify(result, null, 2)}
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}
