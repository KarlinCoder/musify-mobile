import { Pressable, Text, View } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { DrawerActions } from "expo-router/react-navigation";

export default function Navbar() {
  const navigation = useNavigation();

  return (
    <View className="flex flex-row justify-between py-3 px-3 items-center w-full bg-background border-b border-white/6">
      <Pressable
        onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
        className="rounded-full p-1.5 transition-colors active:bg-white/10 "
      >
        <View className="size-8 flex items-center justify-center">
          <FontAwesome6 name="bars" size={24} color="#dedede" />
        </View>
      </Pressable>

      <Text className="font-subtitle text-3xl text-white">Musify</Text>

      <Pressable
        onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
        className="rounded-full p-1.5 transition-colors active:bg-white/10 "
      >
        <View className="size-8 flex items-center justify-center">
          <FontAwesome6 name="gear" size={24} color="#dedede" />
        </View>
      </Pressable>
    </View>
  );
}
