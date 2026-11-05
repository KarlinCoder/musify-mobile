import FloatingHeader from "@/components/FloatingHeader";
import { Text, View } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

interface ScreenProps {
  playlistId: string;
}

export default function PlaylistScreen({ playlistId }: ScreenProps) {
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  return (
    <View className="size-full">
      <FloatingHeader title={playlistId} scrollY={scrollY} />

      <Animated.ScrollView
        className="size-full"
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 800 }}
      >
        <View className="p-4">
          <Text className="text-white text-3xl">{playlistId}</Text>
        </View>
      </Animated.ScrollView>
    </View>
  );
}
