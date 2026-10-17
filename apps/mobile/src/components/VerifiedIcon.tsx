import { MaterialIcons } from "@expo/vector-icons";
import { View } from "react-native";

export default function VerifiedIcon() {
  return (
    <View className="bg-blue-">
      <MaterialIcons name="verified" color={"#51a2ff"} size={17} />
    </View>
  );
}
