import { Stack } from "expo-router";

export default function StackAlbumLayout() {
  return (
    <Stack
      screenOptions={{
        animationDuration: 20,
        headerShown: false,
        contentStyle: { backgroundColor: "#000" },
      }}
    />
  );
}
