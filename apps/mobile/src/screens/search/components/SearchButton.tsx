import { Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";

export default function SearchButton() {
  return (
    <Link href="/search" className="w-full">
      <View className="flex-row items-start gap-2 bg-white rounded-sm px-2 py-3 w-full">
        <Ionicons name="search" size={24} color="#1A1A1A" />
        <Text className="text-[#535353] font-spotify-bold text-[17px]">
          ¿Qué quieres escuchar?
        </Text>
      </View>
    </Link>
  );
}
