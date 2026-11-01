import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function AppNavbar() {
  return (
    <View className="sticky bottom-0 h-15 w-full bg-linear-0">
      <LinearGradient
        // Button Linear Gradient
        colors={["#4c669f", "#3b5998", "#192f6a"]}
      ></LinearGradient>
    </View>
  );
}
