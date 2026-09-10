import { Pressable, Text, View } from "react-native";
import { styled } from "nativewind";
import { useRouter } from "expo-router";

export default function MainScren() {
  const router = useRouter();

  return (
    <View className="flex flex-col gap-2">
      <Text className="text-4xl text-neutral-100">Enlaces</Text>

      {new Array(5).fill(null).map((_, index) => {
        return (
          <Pressable
            onPress={(e) => router.push("/album/[albumId]")}
            className="w-40 px-5 py-2 transition-all rounded-md bg-red-500/40 active:bg-white/70"
          >
            <Text className="text-neutral-100">Enlace #{index}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
