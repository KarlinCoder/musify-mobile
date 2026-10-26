import { ActivityIndicator } from "react-native";

export default function Loader() {
  return (
    <ActivityIndicator
      accessibilityLabel="Cargando"
      color={"#1d9bf0"}
      size={"large"}
    />
  );
}
