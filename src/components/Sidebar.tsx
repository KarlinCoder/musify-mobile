import { FontAwesome6 } from "@expo/vector-icons";
import { ImageBackground } from "expo-image";
import { Href, Link } from "expo-router";
import { Pressable, Text, View } from "react-native";

const searchLinks = [
  {
    icon: "house",
    label: "Popular",
    url: "/" as Href,
    color: "#1DB954",
  },
  {
    icon: "music",
    label: "Canciones",
    url: "/track" as Href,
    color: "#E0245E",
  },
  {
    icon: "compact-disc",
    label: "Álbumes",
    url: "/album" as Href,
    color: "#FF8C00",
  },
  {
    icon: "user",
    label: "Artistas",
    url: "/artist" as Href,
    color: "#7048E8",
  },
  {
    icon: "list-ul",
    label: "Playlists",
    url: "/playlist" as Href,
    color: "#00A6ED",
  },
  {
    icon: "fire",
    label: "Charts",
    url: "/charts" as Href,
    color: "#FF2E63",
  },
];

const menuLinks = [
  { icon: "box-archive", label: "Guardado", url: "/vault" as Href },
  { icon: "gear", label: "Ajustes", url: "/ajustes" as Href },
  { icon: "circle-info", label: "Sobre", url: "/ajustes" as Href },
];

export default function Sidebar() {
  return (
    <Pressable
      onPress={(e) => e.stopPropagation()}
      className="justify-start gap-5 bg-background size-full border-r-2 border-white/6"
    >
      <View className="h-fit border-b-2 border-white/6">
        <ImageBackground
          source={require("../assets/images/sidebar-hero.jpg")}
          contentFit="cover"
          style={{
            width: "auto",
            height: 200,
            justifyContent: "flex-end",
            padding: 20,
          }}
        >
          <Text className="text-4xl font-title text-text">Musify</Text>
          <Text className="text-text-muted text-sm font-secondary">
            Explora y descarga musica.
          </Text>
        </ImageBackground>
      </View>

      <View className="gap-3 grow">
        <View className="flex-row gap-2 flex-wrap justify-center items-center px-2">
          {searchLinks.map((link, index) => {
            return (
              <Link
                key={index}
                href={link.url}
                replace
                className="flex-wrap max-w-[48%] border border-white/7 rounded-lg active:opacity-70 transition-all group"
                style={{
                  backgroundColor: `${link.color}50`,
                  width: "auto",
                }}
              >
                <View className="relative flex-col justify-center items-start px-4 py-6 w-full overflow-hidden">
                  <Text className="text-text font-title text-lg z-2">
                    {link.label}
                  </Text>

                  <View className="absolute top-0 -right-5 rotate-20 opacity-30">
                    <FontAwesome6
                      name={link.icon}
                      size={90}
                      color={link.color}
                    />
                  </View>
                </View>
              </Link>
            );
          })}
        </View>

        <View className="flex-col gap-2.5 px-3 ">
          {menuLinks.map((link, index) => (
            <Link
              key={index}
              href={link.url}
              className="flex-row items-center justify-center bg-white/5 w-full rounded-md px-5 py-3 active:opacity-60"
              style={{ gap: 50 }}
            >
              <View className="flex-1">
                <View className="flex-row gap-2 justify-center items-center">
                  <FontAwesome6 name={link.icon} size={18} color="#aaa" />
                  <Text className="text-text font-secondary text-sm">
                    {link.label}
                  </Text>
                </View>
              </View>
            </Link>
          ))}
        </View>

        <View className="mt-auto p-4">
          <Text className="text-text-muted text-xs font-monospace">v0.1.0</Text>
        </View>
      </View>
    </Pressable>
  );
}
