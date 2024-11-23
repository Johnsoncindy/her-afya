import {
  Pressable,
  View,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { styles } from "@/app/(tabs)/home/styles";

export const SectionHeader = ({
    title,
    onPress,
    showSeeAll = true,
  }: {
    title: string;
    onPress: () => void;
    showSeeAll?: boolean;
  }) => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
        {showSeeAll && (
          <Pressable onPress={onPress}>
            <ThemedText style={styles.seeAll}>See All</ThemedText>
          </Pressable>
        )}
      </View>
    </View>
  );