import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { ThemedView } from "@/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";
import useUserStore from "@/store/userStore";
import { useState } from "react";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { exportData } from "../api/data-export";
import HeartLoading from "@/components/HeartLoading";

// Setting Item Component
const SettingItem = ({
  icon,
  label,
  value,
  onPress,
  showToggle = false,
  isEnabled = false,
  onToggle,
  isLoading = false,
}: {
  icon: string;
  label: string;
  value?: string;
  onPress?: () => void;
  showToggle?: boolean;
  isEnabled?: boolean;
  onToggle?: (value: boolean) => void;
  isLoading?: boolean;
}) => {
  const colorScheme = useColorScheme();

  return (
    <TouchableOpacity onPress={onPress} disabled={showToggle || isLoading}>
      <ThemedView
        style={[
          styles.settingItem,
          { backgroundColor: Colors[colorScheme ?? "light"].background },
        ]}
      >
        <ThemedView style={styles.settingItemLeft}>
          <Ionicons
            name={icon as any}
            size={24}
            color={Colors[colorScheme ?? "light"].icon}
            style={styles.settingIcon}
          />
          <ThemedText style={styles.settingLabel}>{label}</ThemedText>
        </ThemedView>
        {showToggle ? (
          <Switch
            value={isEnabled}
            onValueChange={onToggle}
            trackColor={{
              false: Colors[colorScheme ?? "light"].tint,
              true: Colors[colorScheme ?? "light"].secondary,
            }}
          />
        ) : (
          <ThemedView style={styles.settingItemRight}>
            {isLoading ? (
              <HeartLoading color={Colors[colorScheme ?? "light"].tint} />
            ) : (
              <>
                {value && (
                  <ThemedText style={styles.settingValue}>{value}</ThemedText>
                )}
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={Colors[colorScheme ?? "light"].icon}
                />
              </>
            )}
          </ThemedView>
        )}
      </ThemedView>
    </TouchableOpacity>
  );
};
// Section Header Component
const SectionHeader = ({ title }: { title: string }) => (
  <ThemedText style={styles.sectionHeader}>{title}</ThemedText>
);

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const { user, clearUser } = useUserStore();
  const [loading, setLoading] = useState(false);

  const handleExportData = async () => {
    setLoading(true);
    try {
      // Get the PDF data
      const response = await exportData(user?.id ?? "");

      // Create a temporary file path
      const fileName = `health_report_${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      const filePath = `${FileSystem.documentDirectory}${fileName}`;

      // Download the file
      await FileSystem.downloadAsync(response.config.url ?? "", filePath, {
        headers: response.config.headers,
      });

      // Share the file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(filePath, {
          mimeType: "application/pdf",
          dialogTitle: "Your Health Report",
          UTI: "public.pdf",
        });
      }

      Alert.alert(
        "Success",
        "Your health report has been generated successfully."
      );
    } catch (error) {
      console.error("Export error:", error);
      Alert.alert(
        "Export Failed",
        "Unable to generate health report. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  async function signOut() {
    setLoading(true);
    try {
      clearUser();
    } catch (error) {
      console.error("Error clearing AsyncStorage", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: "Profile",
          headerShadowVisible: false,
        }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <ThemedView style={styles.profileHeader}>
          <ThemedView style={styles.avatarContainer}>
            {user ? (
              <ThemedView style={styles.avatarContainer}>
                {user ? (
                  <Image
                    source={
                      user.photoURL
                        ? { uri: user.photoURL }
                        : require("@/assets/images/default-avatar.avif")
                    }
                    style={styles.avatarImage}
                  />
                ) : (
                  <Ionicons
                    name="person-circle-outline"
                    size={80}
                    color={Colors[colorScheme ?? "light"].icon}
                  />
                )}
              </ThemedView>
            ) : (
              <Ionicons
                name="person-circle-outline"
                size={80}
                color={Colors[colorScheme ?? "light"].icon}
              />
            )}
          </ThemedView>
          <ThemedText style={styles.userName}>{user?.name}</ThemedText>
          <ThemedText style={styles.userEmail}>{user?.email}</ThemedText>
        </ThemedView>

        {/* Account Settings */}
        <SectionHeader title="Account" />
        <SettingItem
          icon="person-outline"
          label="Personal Information"
          onPress={() => {}}
        />
        <SettingItem
          icon="lock-closed-outline"
          label="Security"
          onPress={() => {}}
        />
        <SettingItem icon="shield-outline" label="Privacy" onPress={() => {}} />

        {/* Preferences */}
        <SectionHeader title="Preferences" />
        <SettingItem
          icon="notifications-outline"
          label="Notifications"
          showToggle
          isEnabled={true}
          onToggle={(value) => {}}
        />
        <SettingItem
          icon="globe-outline"
          label="Language"
          value="English"
          onPress={() => {}}
        />
        <SettingItem
          icon="moon-outline"
          label="Dark Mode"
          showToggle
          isEnabled={colorScheme === "dark"}
          onToggle={(value) => {}}
        />

        {/* Data & Storage */}
        <SectionHeader title="Data & Storage" />
        <SettingItem
          icon="download-outline"
          label="Export Data"
          onPress={handleExportData}
          isLoading={loading}
        />

        {/* Help & Support */}
        <SectionHeader title="Help & Support" />
        <SettingItem
          icon="help-circle-outline"
          label="Help Center"
          onPress={() => {}}
        />
        <SettingItem
          icon="information-circle-outline"
          label="About"
          onPress={() => {}}
        />
        <SettingItem icon="exit" label="Logout" onPress={signOut} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 40 : StatusBar.currentHeight,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatarContainer: {
    marginBottom: 12,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    opacity: 0.8,
    marginBottom: 16,
  },
  editProfileButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.light.secondary,
  },
  editProfileText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 24,
    marginBottom: 8,
    opacity: 0.8,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  settingItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingIcon: {
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
  },
  settingItemRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingValue: {
    fontSize: 16,
    opacity: 0.6,
    marginRight: 8,
  },
});
