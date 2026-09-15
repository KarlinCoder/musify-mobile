import { View } from "react-native";
import { GestureDetector, useTapGesture } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";

export default function HomeScreen() {
  const gesture = useTapGesture({
    runOnJS: true,
    onActivate: (e) => {
      console.log(e);
    },
  });

  return (
    <GestureDetector gesture={gesture}>
      <View className="size-full bg-blue-500"></View>
    </GestureDetector>
  );
}
