import { Avatar } from "@kolking/react-native-avatar";
import React from "react";
import { View, ScrollView } from "react-native";

interface Props {
  scroll?: boolean;
  children: React.ReactNode;
}

export default function AppTopBar({ scroll = false, children }: Props) {
  return (
    <View className="flex-row items-center gap-2 relative p-4 pb-0">
      <Avatar name="Giancarlo Dennis" size={38} />
      {!scroll && <View className="shrink grow h-10">{children}</View>}

      {scroll && (
        <ScrollView
          horizontal
          overScrollMode="never"
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-2 w-full -mr-4"
        >
          {children}
        </ScrollView>
      )}
    </View>
  );
}
