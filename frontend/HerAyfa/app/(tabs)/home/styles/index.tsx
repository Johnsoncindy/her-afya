import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 10
    },
    header: {
      padding: 16,
      paddingBottom: 20,
    },
    greeting: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 4,
    },
    subGreeting: {
      fontSize: 16,
      opacity: 0.8,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: 16,
    },
    emergencyButton: {
      padding: 16,
      borderRadius: 12,
      marginBottom: 20,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      backgroundColor: "#FF3B30",
    },
    emergencyText: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold",
    },
    sectionContainer: {
      marginBottom: 10,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 2,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
    },
    seeAll: {
      fontSize: 14,
      color: Colors.light.tint,
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
    reminderCard: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      borderRadius: 12,
      marginBottom: 8,
      gap: 12,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    reminderIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: Colors.light.background,
      alignItems: "center",
      justifyContent: "center",
    },
    reminderContent: {
      flex: 1,
    },
    reminderTitle: {
      fontSize: 14,
      fontWeight: "500",
      marginBottom: 4,
    },
    reminderTime: {
      fontSize: 12,
      opacity: 0.6,
    },
  });
  