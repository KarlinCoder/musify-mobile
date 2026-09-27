import { View } from "react-native";
import Loader from "./Loader";

export default function ScreenLoader() {
  return (
    <View className="bg-background-dark items-center justify-center w-screen h-screen">
      <Loader />
    </View>
  );
}
