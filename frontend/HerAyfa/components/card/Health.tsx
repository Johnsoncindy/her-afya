import {
  Pressable,
  View,
  Image,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { styles } from "@/app/(tabs)/home/styles";

// Types
interface HealthTip {
    category?: string;
    title: string;
    description: string;
    image?: string;
  }

// Component Props
interface HealthTipCardProps extends HealthTip {
    onPress: () => void;
  }
  
  // Components
 export const HealthTipCard = ({
    title,
    description,
    image,
    category,
    onPress,
  }: HealthTipCardProps) => {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? "light"];
    const isLight = colorScheme === "light";
  
    return (
      <Pressable style={styles.tipCardWrapper} onPress={onPress}>
        <ThemedView
          style={[
            styles.healthTipCard,
            {
              backgroundColor: colors.background,
              borderColor: colors.tabIconDefault,
              borderWidth: !isLight ? 1 : 0,
            },
          ]}
        >
          {image && (
            <View style={styles.tipImageContainer}>
              <Image source={{ uri: image }} style={styles.tipImage} />
            </View>
          )}
          <View style={styles.tipContent}>
            {category && (
              <ThemedText style={styles.tipCategory}>{category}</ThemedText>
            )}
            <ThemedText style={styles.healthTipTitle}>{title}</ThemedText>
            <ThemedText style={styles.healthTipDescription}>
              {description}
            </ThemedText>
          </View>
        </ThemedView>
      </Pressable>
    );
  };