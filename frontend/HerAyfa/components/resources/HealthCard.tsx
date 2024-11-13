import { Colors } from "@/constants/Colors";
import { Image, Pressable, StyleSheet, useColorScheme, View } from "react-native";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";

export // Health Tip Card Component with Image Support
const HealthTipCard = ({
  title,
  description,
  image,
  category,
  onPress,
}: {
  title: string;
  description: string;
  image?: string;
  category?: string;
  onPress: () => void;
}) => {
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
            <Image
              source={{ uri: image }}
              alt={title}
              style={styles.tipImage}
            />
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
 const styles = StyleSheet.create({
    tipImageContainer: {
        height: 140,
        width: "100%",
        backgroundColor: "#f0f0f0",
      },
      tipImage: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
      },
      tipContent: {
        padding: 16,
      },
      tipCategory: {
        fontSize: 12,
        color: Colors.light.tint,
        marginBottom: 4,
      },
      healthTipTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 8,
      },
      healthTipDescription: {
        fontSize: 14,
        opacity: 0.8,
      },
      tipsContainer: {
        paddingRight: 16,
        gap: 12,
      },
      tipCardWrapper: {
        width: 280,
      },
      healthTipCard: {
        borderRadius: 12,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
      },
});