import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, Share, TouchableOpacity } from "react-native";
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

interface FloatingHeaderProps {
  title: string;
  scrollY: SharedValue<number>;
  backgroundColor?: string;
  threshold?: number;
  height?: number;
  onShare?: () => void;
}

export default function FloatingHeader({
  title,
  scrollY,
  backgroundColor = "#4488EE",
  threshold = 120,
  height = 50,
  onShare,
}: FloatingHeaderProps) {
  const router = useRouter();

  const backgroundStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [0, threshold],
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [threshold * 0.4, threshold],
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));

  const buttonBackgroundStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [0, threshold],
      [1, 0],
      Extrapolation.CLAMP,
    ),
  }));

  const handleShare = () => {
    if (onShare) {
      onShare();
      return;
    }

    Share.share({ message: `Escucha ${title} en Musify.` });
  };

  return (
    <Animated.View
      className="absolute top-0 left-0 right-0 z-50 flex-row items-center px-4"
      style={{ height }}
      pointerEvents="box-none"
    >
      <Animated.View
        className="absolute inset-0"
        style={[{ backgroundColor }, backgroundStyle]}
        pointerEvents="none"
      />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Volver"
        className="size-8 items-center justify-center z-10"
        hitSlop={8}
        onPress={() => router.back()}
      >
        <Animated.View
          className="absolute inset-0 rounded-full bg-black/40"
          style={buttonBackgroundStyle}
          pointerEvents="none"
        />
        <Ionicons name="arrow-back" size={22} color="#fff" />
      </Pressable>

      <Animated.Text
        className="flex-1 text-center text-white font-spotify-bold text-[15px] mx-3 z-10"
        numberOfLines={1}
        style={titleStyle}
      >
        {title}
      </Animated.Text>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Compartir"
        className="size-8 items-center justify-center z-10"
        hitSlop={8}
        onPress={handleShare}
      >
        <Animated.View
          className="absolute inset-0 rounded-full bg-black/40"
          style={buttonBackgroundStyle}
          pointerEvents="none"
        />
        <Ionicons name="share-outline" size={22} color="#fff" />
      </Pressable>
    </Animated.View>
  );
}
