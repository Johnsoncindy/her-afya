import { Colors } from "@/constants/Colors";
import { Pressable, StyleSheet, useColorScheme, View } from "react-native";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { TabBarIcon } from "../navigation/TabBarIcon";

interface ServiceCardProps {
    name: string;
    type: string;
    distance: string;
    rating: number;
    isOpen?: boolean;
    totalRatings?: number;
    vicinity?: string;
    onPress: () => void;
    onDirectionsPress?: () => void;
    latitude?: number;
    longitude?: number;
  }
export const ServiceCard: React.FC<ServiceCardProps> = ({
    name,
    type,
    distance,
    rating,
    isOpen,
    totalRatings,
    vicinity,
    onPress,
    onDirectionsPress = () => {}, // Provide default value
  }) => {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? "light"];
    const isLight = colorScheme === "light";
  
    return (
      <Pressable onPress={onPress}>
        <ThemedView
          style={[
            styles.serviceCard,
            {
              backgroundColor: colors.background,
              borderColor: colors.tabIconDefault,
              borderWidth: !isLight ? 1 : 0,
            },
          ]}
        >
          <ThemedView style={styles.serviceHeader}>
            <ThemedView style={styles.headerLeft}>
              <ThemedText style={styles.serviceName}>{name}</ThemedText>
              <ThemedText style={styles.serviceType}>{type}</ThemedText>
              {isOpen !== undefined && (
                <ThemedView style={styles.openStatusContainer}>
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: isOpen ? "#4CAF50" : "#FF5252" },
                    ]}
                  />
                  <ThemedText style={styles.openStatus}>
                    {isOpen ? "Open" : "Closed"}
                  </ThemedText>
                </ThemedView>
              )}
            </ThemedView>
            {rating > 0 && (
              <ThemedView style={styles.ratingSection}>
                <ThemedView style={styles.ratingContainer}>
                  <TabBarIcon name="star" color={colors.tint} size={16} />
                  <ThemedText style={styles.rating}>
                    {rating.toFixed(1)}
                  </ThemedText>
                </ThemedView>
                {totalRatings !== undefined && totalRatings > 0 && (
                  <ThemedText style={styles.totalRatings}>
                    ({totalRatings})
                  </ThemedText>
                )}
              </ThemedView>
            )}
          </ThemedView>
  
          <ThemedView style={styles.serviceFooter}>
            <ThemedView style={styles.locationInfo}>
              <ThemedView style={styles.distanceContainer}>
                <ThemedText style={styles.distance}>{distance}</ThemedText>
              </ThemedView>
              {vicinity && (
                <ThemedText style={styles.vicinity} numberOfLines={1}>
                  {vicinity}
                </ThemedText>
              )}
            </ThemedView>
            {onDirectionsPress && (
              <Pressable
                style={[styles.directionButton, { backgroundColor: colors.tint }]}
                onPress={onDirectionsPress}
              >
                <ThemedText style={styles.directionButtonText}>
                  Directions
                </ThemedText>
              </Pressable>
            )}
          </ThemedView>
        </ThemedView>
      </Pressable>
    );
  };

  const styles = StyleSheet.create({
    serviceCard: {
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 16,
        marginBottom: 12,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      serviceHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 12,
      },
      headerLeft: {
        flex: 1,
        marginRight: 8,
      },
      serviceName: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 4,
      },
      serviceType: {
        fontSize: 14,
        opacity: 0.7,
        marginBottom: 4,
      },
      openStatusContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 4,
      },
      statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
      },
      openStatus: {
        fontSize: 12,
        opacity: 0.8,
      },
      ratingSection: {
        alignItems: "flex-end",
      },
      ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 2,
      },
      rating: {
        marginLeft: 4,
        fontSize: 14,
        fontWeight: "500",
      },
      totalRatings: {
        fontSize: 12,
        opacity: 0.7,
      },
      serviceFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
      },
      locationInfo: {
        flex: 1,
        marginRight: 8,
      },
      distanceContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
      },
      distance: {
        marginLeft: 4,
        fontSize: 14,
      },
      vicinity: {
        fontSize: 12,
        opacity: 0.7,
      },
      directionButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
      },
      directionButtonText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "500",
      },
  });