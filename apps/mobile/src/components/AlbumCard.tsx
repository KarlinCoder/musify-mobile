import { Image } from "expo-image";
import { Text, View } from "react-native";
import ExplicitMark from "./ExplicitMark";
import { useEffect, useState } from "react";

interface Props {
  album: Album;
}

export default function AlbumCard({ album }: Props) {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    console.log(imageLoaded);
  }, [imageLoaded]);

  return (
    <View className="gap-2" style={{ width: 160 }}>
      <Image
        onLoadStart={() => setImageLoaded(false)}
        onLoad={() => setImageLoaded(true)}
        source={album.cover}
        placeholder={require("../assets/images/fallback/album.png")}
        placeholderContentFit="cover"
        contentFit="cover"
        style={{ width: 160, height: 160, borderRadius: 5 }}
      />

      <View className="gap-1">
        <Text
          numberOfLines={2}
          className="text-text text-[15px] font-spotify-medium"
        >
          {album.title}
        </Text>
        <View className="flex-row items-center gap-1.5">
          {album.explicit_lyrics && <ExplicitMark />}

          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            className="flex-row gap-2 text-text-muted text-[13px] font-spotify-regular pr-6"
          >
            {album.type} <Text className="font-spotify-bold">·</Text>{" "}
            {album.artists?.map((artist) => artist.name).join(", ") ?? ""}
          </Text>
        </View>
      </View>
    </View>
  );
}
