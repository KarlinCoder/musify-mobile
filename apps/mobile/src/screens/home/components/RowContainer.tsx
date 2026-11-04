import { View, ScrollView, Text } from "react-native";
import { splitArray } from "../utils/split-array";
import PlaylistCard from "@/components/PlaylistCard";

interface Props {
  title: string;
  children: React.ReactNode;
}

export default function RowContainer({ title, children }: Props) {
  return (
    <View className="w-full">
      <Text className="text-text text-[21px] font-spotify-bold">{title}</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        className="-mx-4"
        overScrollMode="never"
        alwaysBounceHorizontal
        bounces={false}
        contentContainerClassName="mt-2 px-3.5 gap-4"
      >
        {children}
      </ScrollView>
    </View>
  );
}
