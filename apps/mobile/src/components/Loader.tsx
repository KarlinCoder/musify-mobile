import { ActivityIndicator, View } from "react-native";

export default function Loader() {
  return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator
        size="large"
        colorClassName="accent-blue-500 dark:accent-blue-400"
      />
    </View>
  );
}
