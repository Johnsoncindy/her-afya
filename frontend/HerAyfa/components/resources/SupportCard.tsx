import { Colors } from "@/constants/Colors";
import { Dimensions, Pressable, StyleSheet, useColorScheme } from "react-native";
import { SupportRequestCard, SupportType, User } from "./types";
import { ThemedView } from "../ThemedView";
import { FontAwesome5 } from "@expo/vector-icons";
import { ThemedText } from "../ThemedText";
import { TabBarIcon } from "../navigation/TabBarIcon";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.9;
// Verification Badge Component
/* const VerificationBadge: React.FC<{ status: VerificationStatus }> = ({
    status,
  }) => {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? "light"];
  
    const getBadgeColor = () => {
      switch (status) {
        case "verified":
          return "#4CAF50";
        case "pending":
          return "#FFC107";
        default:
          return "#757575";
      }
    };
  
    return (
      <ThemedView style={[styles.badge, { backgroundColor: getBadgeColor() }]}>
        <FontAwesome5
          name={status === "verified" ? "check-circle" : "clock"}
          color="#FFFFFF"
          size={12}
        />
        <ThemedText style={styles.badgeText}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </ThemedText>
      </ThemedView>
    );
  }; */
export const SupportCard: React.FC<{
    request: SupportRequestCard;
    onRespond: (id: string) => void;
    onShare: (request: SupportRequestCard) => void;
    user?: User;
  }> = ({ request, onRespond, onShare, user }) => {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? "light"];
  
    const getTypeIcon = (type: SupportType) => {
      switch (type) {
        case "emotional":
          return "hand-holding-heart";
        case "resources":
          return "book";
        case "guidance":
          return "compass";
        case "companionship":
          return "user-friends";
        default:
          return "hands-helping";
      }
    };
  
    return (
      <ThemedView
        style={[
          styles.card,
          {
            borderColor: request.isEmergency ? "#FF4444" : colors.tabIconDefault,
            borderWidth: request.isEmergency ? 2 : 1,
          },
        ]}
      >
        {request.isEmergency && (
          <ThemedView
            style={[styles.emergencyBanner, { backgroundColor: "#FF4444" }]}
          >
            <FontAwesome5 name="exclamation-triangle" color="#FFFFFF" size={16} />
            <ThemedText style={styles.emergencyText}>
              Emergency Support Needed
            </ThemedText>
          </ThemedView>
        )}
  
        <ThemedView style={styles.cardHeader}>
          <ThemedView style={styles.cardHeaderLeft}>
            <FontAwesome5
              name={getTypeIcon(request.type)}
              color={colors.tint}
              size={24}
            />
            <ThemedText style={styles.cardType}>
              {request.type.charAt(0).toUpperCase() + request.type.slice(1)}{" "}
              Support
            </ThemedText>
          </ThemedView>
          {/* user && <VerificationBadge status={user.verificationStatus} /> */}
        </ThemedView>
  
        <ThemedText style={styles.cardTitle}>{request.title}</ThemedText>
        <ThemedText style={styles.cardDescription}>
          {request.description}
        </ThemedText>
  
        <ThemedView style={styles.cardFooter}>
          <ThemedText style={styles.cardLocation}>
            📍 {request.location.address}{" "}
            {request.distance && `(${request.distance.toFixed(1)}km)`}
          </ThemedText>
          <ThemedText style={styles.cardDate}>{request.date}</ThemedText>
        </ThemedView>
  
       {/*  {user && (
          <ThemedView style={styles.userInfo}>
            <ThemedText style={styles.helperStats}>
              ⭐ {user.rating.toFixed(1)} · Helped {user.helpCount} sisters
            </ThemedText>
          </ThemedView>
        )} */}
  
        <ThemedView style={styles.cardActions}>
          <Pressable
            onPress={() => onRespond(request.id)}
            style={[styles.actionButton, { backgroundColor: colors.tint }]}
          >
            <ThemedText style={styles.actionButtonText}>Respond</ThemedText>
          </Pressable>
          <Pressable
            onPress={() => onShare(request)}
            style={[styles.actionButton, { backgroundColor: colors.background }]}
          >
            <TabBarIcon name="share" color={colors.text} size={20} />
          </Pressable>
        </ThemedView>
      </ThemedView>
    );
  };

  const styles = StyleSheet.create({
    card: {
        width: CARD_WIDTH * 0.93,
        borderRadius: 12,
        padding: 10,
        marginBottom: 16,
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
      },
      emergencyBanner: {
        flexDirection: "row",
        alignItems: "center",
        padding: 8,
        borderRadius: 8,
        marginBottom: 12,
      },
      emergencyText: {
        color: "#FFFFFF",
        marginLeft: 8,
        fontWeight: "600",
      },
      cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
      },
      cardHeaderLeft: {
        flexDirection: "row",
        alignItems: "center",
      },
      cardType: {
        marginLeft: 8,
        fontSize: 14,
        fontWeight: "600",
      },
      badge: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
      },
      badgeText: {
        color: "#FFFFFF",
        fontSize: 12,
        marginLeft: 4,
      },
      cardTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
      },
      cardDescription: {
        fontSize: 14,
        marginBottom: 12,
        opacity: 0.8,
      },
      cardFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
      },
      cardLocation: {
        fontSize: 12,
        opacity: 0.7,
      },
      cardDate: {
        fontSize: 12,
        opacity: 0.7,
      },
      userInfo: {
        marginBottom: 12,
      },
      helperStats: {
        fontSize: 12,
        opacity: 0.7,
      },
      cardActions: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      },
      actionButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      },
      actionButtonText: {
        color: "#FFFFFF",
        fontWeight: "600",
      },
  })