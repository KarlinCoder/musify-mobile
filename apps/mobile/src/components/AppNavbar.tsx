import { View, Pressable, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link, usePathname } from "expo-router";

type TabKey = "home" | "search" | "saved" | "premium" | "downloads";
type TabHref = "/" | "/search" | "/my-library" | "/premium" | "/downloads";

const tabs: {
  key: TabKey;
  label: string;
  href: TabHref;
  icon: keyof typeof Ionicons.glyphMap;
  iconActive: keyof typeof Ionicons.glyphMap;
}[] = [
  {
    key: "home",
    label: "Inicio",
    href: "/",
    icon: "home-outline",
    iconActive: "home",
  },
  {
    key: "search",
    label: "Buscar",
    href: "/search",
    icon: "search-outline",
    iconActive: "search",
  },
  {
    key: "saved",
    label: "Guardados",
    href: "/my-library",
    icon: "library-outline",
    iconActive: "library-sharp",
  },
  {
    key: "premium",
    label: "Premium",
    href: "/premium",
    icon: "diamond-outline",
    iconActive: "diamond",
  },
  {
    key: "downloads",
    label: "Descargas",
    href: "/downloads",
    icon: "arrow-down-circle-outline",
    iconActive: "arrow-down-circle",
  },
];

export default function AppNavbar() {
  const pathname = usePathname().replace(/\/+$/, "") || "/";

  return (
    <View className="absolute bottom-0 left-0 right-0">
      <LinearGradient
        colors={["transparent", "#000000cc", "#000000", "#000000"]}
        className="size-full flex-row items-center justify-around h-20 w-full"
      >
        {tabs.map((tab) => {
          const isActive =
            tab.href === "/"
              ? pathname === "/"
              : pathname === tab.href || pathname.startsWith(`${tab.href}/`);

          return (
            <Link key={tab.key} href={tab.href} asChild>
              <Pressable className="flex-1 items-center justify-center gap-1 py-1">
                <Ionicons
                  name={isActive ? tab.iconActive : tab.icon}
                  size={28}
                  color={isActive ? "#FFFFFF" : "#B3B3B3"}
                />
                <Text
                  className={`text-[11px] font-spotify-regular ${
                    isActive ? "text-white font-semibold" : "text-[#B3B3B3]"
                  }`}
                >
                  {tab.label}
                </Text>
              </Pressable>
            </Link>
          );
        })}
      </LinearGradient>
    </View>
  );
}
