import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native";

import { Link, usePathname } from "expo-router";
import { FontAwesome6 } from "@expo/vector-icons";

interface Props {
  onClose: () => void;
}

export default function Sidebar({ onClose }: Props) {
  const pathname = usePathname();

  const menuLinks = [
    { icon: "house", label: "Inicio", url: "/xd" },
    { icon: "music", label: "Canciones", url: "/app/track" },
    { icon: "compact-disc", label: "Álbumes", url: "/app/album" },
    { icon: "user", label: "Artistas", url: "/app/artist" },
    { icon: "list-ul", label: "Playlists", url: "/app/playlist" },
    { icon: "fire", label: "Charts", url: "/app/charts" },
    { icon: "box-archive", label: "Vault", url: "/app/vault" },
    { icon: "gear", label: "Ajustes", url: "/app/ajustes" },
  ];

  return (
    <View className="absolute inset-0">
      <Pressable className="absolute inset-0 flex-1 bg-black/50" onPress={onClose} />

      <View className="absolute top-0 left-0 bottom-0 w-75">
        <Pressable
          onPress={(e) => e.stopPropagation()}
          className="flex-1 bg-black border-r border-white/6 p-6 pb-3"
        >
          <View className="px-2">
            <Image
              source={require("../assets/logo.webp")}
              className="w-20 h-20 rounded-lg shadow-2xl shadow-black border border-white/8"
              resizeMode="contain"
            />
            <Text className="text-white text-3xl font-bold mt-2 tracking-wide">
              Musify
            </Text>
            <Text className="text-white/60 text-sm mt-1">
              Tu biblioteca musical personal.
            </Text>
            <View className="h-px bg-white/10 rounded-full my-3" />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerClassName="pb-4"
          >
            {menuLinks.map((item) => {
              // Lógica simple de ruta activa
              const isActive =
                pathname === item.url ||
                (item.url !== "/app" && pathname.startsWith(item.url));

              return (
                <Link href={item.url as any} key={item.label} asChild>
                  <TouchableOpacity
                    className={`flex-row items-center gap-2 px-4 py-3 rounded-lg mb-1 relative ${
                      isActive ? "bg-white/3" : "hover:bg-white/5"
                    }`}
                  >
                    {isActive && (
                      <View className="absolute left-1 top-[50%] -translate-y-1/2 w-1 h-5 bg-green-500 rounded-full" />
                    )}

                    <FontAwesome6
                      name={item.icon}
                      size={20}
                      color={isActive ? "#ffffff" : "#d4d4d8"}
                    />

                    <Text
                      className={`text-base font-medium ${
                        isActive ? "text-white" : "text-neutral-300"
                      }`}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                </Link>
              );
            })}
          </ScrollView>

          {/* Footer Version */}
          <Text className="mt-auto px-5 text-white/50 text-xs pt-4">
            v0.1.0
          </Text>
        </Pressable>
      </View>
    </View>
  );
}