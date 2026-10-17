import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function AlbumDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View className="flex-1 items-center justify-center bg-background-dark">
      <Text className="text-white text-xl font-title">Album ID: {id}</Text>
    </View>
  );
}
