import { useEffect } from "react";
import { View, ViewStyle } from "react-native";
import { Image } from "expo-image";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  cancelAnimation,
} from "react-native-reanimated";

type LoaderProps = {
  /** Tamaño del logo en px. Default 96 */
  size?: number;
  /** Si true ocupa toda la pantalla y centra el logo. Default false */
  fullScreen?: boolean;
  /** Estilo extra para el contenedor */
  style?: ViewStyle;
  /** Duración de cada fase (ms). Default 750 */
  duration?: number;
  /** Opacidad mínima del pulso. Default 0.35 */
  minOpacity?: number;
};

/**
 * Loader con el logo de Musify (`logo-white-transparent`) y efecto de pulso:
 * el logo "se aclara y se enciende" mediante animación de opacidad + escala + brillo.
 *
 * Usa `expo-image` + `react-native-reanimated`. No requiere `react-native-svg`.
 *
 * @example
 * ```tsx
 * import Loader from "@/components/Loader"
 * // Pantalla completa
 * <Loader fullScreen size={120} />
 * // Inline
 * <Loader size={48} />
 * ```
 */
export default function Loader({
  size = 96,
  fullScreen = false,
  style,
  duration = 750,
  minOpacity = 0.35,
}: LoaderProps) {
  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1, {
          duration,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(0, {
          duration,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      true
    );

    return () => cancelAnimation(pulse);
  }, [duration, pulse]);

  const animatedLogoStyle = useAnimatedStyle(() => {
    return {
      opacity: minOpacity + pulse.value * (1 - minOpacity),
      transform: [{ scale: 0.94 + pulse.value * 0.08 }],
      // brillo: sombra blanca que pulsa junto a la opacidad
      shadowColor: "#FFFFFF",
      shadowOpacity: 0.3 + pulse.value * 0.5,
      shadowRadius: 12 + pulse.value * 16,
      shadowOffset: { width: 0, height: 0 },
    };
  });

  const animatedGlowStyle = useAnimatedStyle(() => {
    return {
      opacity: pulse.value * 0.25,
      transform: [{ scale: 0.9 + pulse.value * 0.35 }],
    };
  });

  const containerStyle: ViewStyle = fullScreen
    ? {
        flex: 1,
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000000",
      }
    : {
        alignItems: "center",
        justifyContent: "center",
      };

  return (
    <View
      style={[containerStyle, style]}
      className={fullScreen ? "bg-background-dark" : undefined}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel="Cargando"
    >
      <View
        style={{
          width: size,
          height: size,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Glow exterior - efecto "encendido" */}
        <Animated.View
          style={[
            {
              position: "absolute",
              width: size * 0.85,
              height: size * 0.85,
              borderRadius: size / 2,
              backgroundColor: "#FFFFFF",
            },
            animatedGlowStyle,
          ]}
        />

        {/* Logo con pulso de opacidad + escala + sombra */}
        <Animated.View style={animatedLogoStyle}>
          <Image
            // PNG con transparencia; el SVG corregido está en src/assets/brand/svg/logo-white-transparent.svg
            // Si preferís SVG, podés cambiar a: require("@/assets/brand/svg/logo-white-transparent.svg")
            source={require("@/assets/brand/logo-white-transparent.png")}
            contentFit="contain"
            cachePolicy="memory-disk"
            transition={0}
            style={{ width: size, height: size }}
            priority="high"
            accessible={false}
          />
        </Animated.View>
      </View>
    </View>
  );
}

/** Alias para import nombrado */
export const PulseLoader = Loader;
export const MusifyLoader = Loader;
