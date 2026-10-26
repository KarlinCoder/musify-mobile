import Loader from "@/components/Loader";
import { getCharts } from "@/services/deezer.service";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function HomeScreen() {
  const [isLoading, setisLoading] = useState(false);
  const [charts, setCharts] = useState<MFPopular>();

  useEffect(() => {
    const fetchData = async () => {
      setisLoading(true);
      const res = await getCharts();
      setCharts(res);
      setisLoading(false);

      //   alert(JSON.stringify(charts, null, 2));
    };

    fetchData();
  }, []);

  return (
    <View className="flex-1 items-center justify-center gap-1 bg-bg">
      <Text className="font-spotify-bold text-2xl text-text">Home</Text>
      <Text className="text-sm text-muted">Pantalla en construcción</Text>

      {isLoading && <Loader />}

      <View className="flex flex-col gap-2">
        {charts?.artists.map((track) => (
          <Text key={track.id}>{track.name}</Text>
        ))}
      </View>
    </View>
  );
}
