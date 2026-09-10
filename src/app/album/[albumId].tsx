import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function AlbumPage() {
  const { albumId } = useLocalSearchParams();

  return (
    <View key={albumId[0]} className="flex-1 text-white">
      <Text className="text-2xl">Hola</Text>
    </View>
  );
}
