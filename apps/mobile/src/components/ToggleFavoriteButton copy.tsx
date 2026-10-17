import { FontAwesome6 } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

interface Props {
  isFavorite: boolean;
  onToggle: () => void;
}

export default function ToggleFavoriteButton({ isFavorite, onToggle }: Props) {
  return (
    <Pressable
      onPress={onToggle}
      className="rounded-full active:bg-background-light p-1"
    >
      <View className="size-7 items-center justify-center">
        {!isFavorite ? (
          <FontAwesome6 name="heart" color="#dedede" size={20} />
        ) : (
          <FontAwesome6 name="heart-circle-check" color="#dedede" size={20} />
        )}
      </View>
    </Pressable>
  );
}
