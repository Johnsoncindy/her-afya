import React, { useState } from "react";
import {
  StyleSheet,
  ScrollView,
  Pressable,
  Share,
  Alert,
  Modal,
} from "react-native";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";
import useUserStore from "@/store/userStore";
import {
  SupportRequestCard,
  SupportType,
  TabType,
} from "./types";
import { SupportCard } from "./SupportCard";
import { SupportRequest } from "@/store/types/support";
import ChatModal from "../modal/ChatModal";
import { ChatInbox } from "../modal/ChatInbox";

// Filter Component
const FilterSection: React.FC<{
  selectedType: SupportType | "all";
  setSelectedType: (type: SupportType | "all") => void;
  searchRadius: number;
  setSearchRadius: (radius: number) => void;
}> = ({ selectedType, setSelectedType, searchRadius, setSearchRadius }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const supportTypes: (SupportType | "all")[] = [
    "all",
    "emotional",
    "resources",
    "guidance",
    "companionship",
  ];

  return (
    <ThemedView style={styles.filterContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {supportTypes.map((type) => (
          <Pressable
            key={type}
            style={[
              styles.filterChip,
              {
                backgroundColor:
                  selectedType === type ? colors.tint : colors.background,
                borderColor: colors.tint,
              },
            ]}
            onPress={() => setSelectedType(type)}
          >
            <ThemedText
              style={[
                styles.filterChipText,
                { color: selectedType === type ? "#FFFFFF" : colors.text },
              ]}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </ThemedText>
          </Pressable>
        ))}
      </ScrollView>

      <ThemedView style={styles.radiusSelector}>
        <ThemedText style={styles.radiusLabel}>
          Search Radius: {searchRadius}km
        </ThemedText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[5, 10, 25, 50].map((radius) => (
            <Pressable
              key={radius}
              style={[
                styles.radiusChip,
                {
                  backgroundColor:
                    searchRadius === radius ? colors.tint : colors.background,
                  borderColor: colors.tint,
                },
              ]}
              onPress={() => setSearchRadius(radius)}
            >
              <ThemedText
                style={[
                  styles.radiusChipText,
                  { color: searchRadius === radius ? "#FFFFFF" : colors.text },
                ]}
              >
                {radius}km
              </ThemedText>
            </Pressable>
          ))}
        </ScrollView>
      </ThemedView>
    </ThemedView>
  );
};

// Main Component
export const SisterKeeperContent: React.FC<{
  supportRequest: SupportRequest[];
}> = ({ supportRequest }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const [selectedType, setSelectedType] = useState<SupportType | "all">("all");
  const [searchRadius, setSearchRadius] = useState(10);
  const [chatVisible, setChatVisible] = useState(false);
  const userId = useUserStore.getState().user?.id;
  const [chatInboxVisible, setChatInboxVisible] = useState(false);
  const [selectedSupportRequestId, setSelectedSupportRequestId] = useState<
    string | null
  >(null);
  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [selectedTab, setSelectedTab] = useState<TabType>("all");

  const handleRespond = (id: string) => {
    const request = supportRequest.find((r) => r.id === id);
    if (request) {
      setSelectedSupportRequestId(request.id);
      if (request.isEmergency) {
        Alert.alert(
          "Emergency Support Request",
          "This is an urgent request. Are you able to provide immediate assistance?",
          [
            {
              text: "Yes, I Can Help",
              onPress: () => {
                setSelectedUser({
                  id: request.userId,
                  name:
                    request.anonymous === true
                      ? "Anonymous"
                      : request.displayName || "John",
                });
                setChatVisible(true);
              },
            },
            { text: "Not Right Now", style: "cancel" },
          ]
        );
      } else {
        setSelectedUser({
          id: request.userId,
          name:
            request.anonymous === true
              ? "Anonymous"
              : request.user.displayName || "John",
        });
        setChatVisible(true);
      }
    }
  };

  const handleShare = async (request: SupportRequestCard) => {
    try {
      await Share.share({
        message: `${request.isEmergency ? "🚨 URGENT: " : ""}${
          request.title
        }\n\n${request.description}\n\nLocation: ${request.location}`,
        title: "Be A Sister's Keeper",
      });
    } catch (error) {
      console.error(error);
    }
  };

  // Filter support requests based on selected tab, type, and search radius
  const filteredRequests = (supportRequest || []).filter((request) => {
    const isUserRequest = request.userId === userId;

    if (selectedTab === "user" && !isUserRequest) return false;
    if (selectedTab === "all" && isUserRequest) return false;
    if (selectedType !== "all" && request.type !== selectedType) return false;
    if (request.distance && request.distance > searchRadius) return false;
    return true;
  });

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedView style={styles.headerContent}>
          <ThemedText style={styles.headerText}>
            Support Messages ➡️
          </ThemedText>
          <Pressable onPress={() => setChatInboxVisible(true)}>
            <TabBarIcon
              name="chatbubble-outline"
              size={24}
              color={colors.text}
            />
          </Pressable>
        </ThemedView>
      </ThemedView>
      {/* Tab Navigation */}
      <ThemedView style={styles.tabContainer}>
        <Pressable
          style={[
            styles.tabButton,
            selectedTab === "all" && { backgroundColor: colors.tint },
          ]}
          onPress={() => setSelectedTab("all")}
        >
          <ThemedText style={styles.tabButtonText}>
            Community Requests
          </ThemedText>
        </Pressable>
        <Pressable
          style={[
            styles.tabButton,
            selectedTab === "user" && { backgroundColor: colors.tint },
          ]}
          onPress={() => setSelectedTab("user")}
        >
          <ThemedText style={styles.tabButtonText}>My Requests</ThemedText>
        </Pressable>
      </ThemedView>

      {/* Filter Section */}
      <FilterSection
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        searchRadius={searchRadius}
        setSearchRadius={setSearchRadius}
      />

      {/* Support Requests */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredRequests.map((request) => (
          <SupportCard
            key={request.id}
            request={request}
            onRespond={handleRespond}
            onShare={handleShare}
            user={request.user}
          />
        ))}
      </ScrollView>

      <Pressable
        style={[styles.createButton, { backgroundColor: colors.tint }]}
        onPress={() => router.push("/support-request")}
      >
        <FontAwesome5 name="plus-circle" color="#FFFFFF" size={24} />
        <ThemedText style={styles.createButtonText}>
          Create Support Request
        </ThemedText>
      </Pressable>

      {selectedUser && (
        <ChatModal
          visible={chatVisible}
          onClose={() => {
            setChatVisible(false);
            setSelectedUser(null);
            setSelectedSupportRequestId(null);
          }}
          recipientId={selectedUser.id}
          recipientName={selectedUser.name}
          supportRequestId={selectedSupportRequestId || ""}
        />
      )}
      <Modal
        visible={chatInboxVisible}
        animationType="slide"
        onRequestClose={() => setChatInboxVisible(false)}
      >
        <ChatInbox />
      </Modal>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    padding: 8,
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.tint,
    marginHorizontal: 5,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  header: {
    marginBottom: 16,
  },
  headerText: {
    fontSize: 16,
    opacity: 0.8,
    textAlign: "center",
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: "500",
  },
  radiusSelector: {
    marginTop: 12,
  },
  radiusLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  radiusChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
  },
  radiusChipText: {
    fontSize: 14,
  },

  createButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    marginTop: 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
  },
  chatHeaderText: {
    fontSize: 18,
    fontWeight: "600",
  },
  messageContainer: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 16,
    marginVertical: 4,
    marginHorizontal: 16,
  },
  messageText: {
    fontSize: 14,
  },
  messageInput: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    marginRight: 12,
    padding: 8,
    borderRadius: 20,
    fontSize: 14,
  },
});
