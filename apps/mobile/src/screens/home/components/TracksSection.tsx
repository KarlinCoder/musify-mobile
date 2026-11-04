import TrackCard from "@/components/TrackCard";
import { useState } from "react";
import { View, ScrollView, Text } from "react-native";
import { splitArray } from "../utils/split-array";

interface Props {
  title: string;
  tracks: Track[];
}

export default function TracksSection({ title, tracks }: Props) {
  const [containerWidth, setContainerWidth] = useState(0);
  const [carouselWidth, setCarouselWidth] = useState(0);

  const groupedTracks = splitArray(tracks, 3);

  const PAGE_WIDTH = containerWidth * 0.97;
  const GAP = 12;

  return (
    <View
      className="w-full"
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      <Text className="text-text text-[21px] font-spotify-bold">{title}</Text>

      <ScrollView
        horizontal
        onLayout={(e) => setCarouselWidth(e.nativeEvent.layout.width)}
        showsHorizontalScrollIndicator={false}
        snapToInterval={PAGE_WIDTH + GAP}
        snapToAlignment="start"
        decelerationRate="fast"
        className="-mx-4"
        overScrollMode="never"
        alwaysBounceHorizontal
        bounces={false}
        contentContainerClassName="mt-2 px-1.5"
        contentContainerStyle={{
          gap: GAP,
          paddingRight: Math.max(0, carouselWidth - PAGE_WIDTH),
        }}
      >
        {groupedTracks.map((tracksInGroup, index) => (
          <View
            key={index}
            style={{
              width: PAGE_WIDTH,
            }}
          >
            {tracksInGroup.map((track) => (
              <TrackCard key={track.id} track={track} />
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
