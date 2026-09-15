import { NavigationBar } from "expo-navigation-bar";
import { StatusBar } from "react-native";

export default function Customization() {
  return (
    <>
      <StatusBar barStyle="light-content" />
      <NavigationBar style="light" />
    </>
  );
}
