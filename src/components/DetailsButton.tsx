import { FontAwesome6 } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

interface Props {
  onPress?: () => void;
}

export default function DetailsButton({ onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      className="rounded-full active:bg-background-light p-1"
    >
      <View className="size-7 items-center justify-center">
        <FontAwesome6 name="ellipsis-vertical" color="#dedede" size={20} />
      </View>
    </Pressable>
  );
}
