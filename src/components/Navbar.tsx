import { Pressable, Text, View } from "react-native";
import { Image } from "expo-image";
import { FontAwesome6 } from "@expo/vector-icons";

interface Props {
  showSidebar: boolean;
  onShowSidebar: () => void;
}

export default function Navbar({ showSidebar, onShowSidebar }: Props) {
  return (
    <View className="flex flex-row justify-between py-5 px-3 items-center w-full bg-background border-b border-white/0">
      <View className="flex flex-row items-center justify-start gap-1">
        <Pressable
          onPress={onShowSidebar}
          className="rounded-full p-1.5 transition-colors active:bg-white/10 "
        >
          <View className="size-8 flex items-center justify-center">
            {showSidebar ? (
              <FontAwesome6 name="bars" size={24} className="text-text block" />
            ) : (
              <FontAwesome6
                name="bars-staggered"
                size={24}
                className="text-text block"
              />
            )}
          </View>
        </Pressable>

        <Image source={require("../assets/logo.webp")} />

        <Text className="font-primary text-4xl text-white">Musify</Text>
      </View>
    </View>
  );
}
