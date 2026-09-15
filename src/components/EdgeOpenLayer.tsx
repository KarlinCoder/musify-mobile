import { View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";

interface Props {
  onOpen: () => void;
}

const EDGE_WIDTH = 40;

export default function EdgeOpenLayer({ onOpen }: Props) {
  const openGesture = Gesture.Pan()
    .activeOffsetX(12)
    .failOffsetX(-12)
    .onEnd((e) => {
      if (e.translationX > 60 || e.velocityX > 600) {
        runOnJS(onOpen)();
      }
    });

  return (
    <GestureDetector gesture={openGesture}>
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: EDGE_WIDTH,
        }}
      />
    </GestureDetector>
  );
}