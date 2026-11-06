import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Pressable, Share, View } from "react-native";
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

function darkenColor(hex: string, amount = 0.5): string {
  const value = hex.replace("#", "");

  if (![3, 6, 8].includes(value.length)) {
    return hex;
  }

  const normalized =
    value.length === 3
      ? value
          .split("")
          .map((char) => char + char)
          .join("")
      : value;

  const channels = [0, 2, 4].map((index) =>
    parseInt(normalized.slice(index, index + 2), 16),
  );

  if (channels.some((channel) => Number.isNaN(channel))) {
    return hex;
  }

  const darkened = channels
    .map((channel) => Math.round(channel * (1 - amount)))
    .map((channel) => channel.toString(16).padStart(2, "0"))
    .join("");

  const alpha = normalized.slice(6, 8);

  return `#${darkened}${alpha}`;
}

interface FloatingHeaderProps {
  title: string;
  color?: string;
  scrollY: SharedValue<number>;
  threshold?: number;
  height?: number;
  onShare?: () => void;
}

export default function FloatingHeader({
  title,
  scrollY,
  color = "#000",
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
      className="absolute top-0 left-0 right-0 z-50"
      style={{ height }}
      pointerEvents="box-none"
    >
      <Animated.View
        className="absolute inset-0"
        style={backgroundStyle}
        pointerEvents="none"
      >
        <LinearGradient
          colors={[color, darkenColor(color)]}
          style={{ width: "100%", height: "100%" }}
        />
      </Animated.View>

      <View className="flex-1 flex-row items-center px-4" pointerEvents="box-none">
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
      </View>
    </Animated.View>
  );
}
