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
import { router, Stack } from "expo-router";
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

interface FileSystemError extends Error {
  code?: string;
}

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
      
      if (!response?.data?.data) {
        throw new Error("No PDF data received");
      }
  
      // Define file path based on platform
      const baseDir = Platform.OS === 'ios' 
        ? FileSystem.documentDirectory 
        : FileSystem.cacheDirectory;
        
      if (!baseDir) {
        throw new Error("No writable directory available");
      }
  
      const fileName = `health_report_${new Date().toISOString().split("T")[0]}.pdf`;
      const filePath = baseDir + fileName;
  
      try {
        // Use response.data.data to get the actual base64 string
        await FileSystem.writeAsStringAsync(filePath, response.data.data, {
          encoding: FileSystem.EncodingType.Base64
        });
  
        // Verify file exists and has content
        const fileInfo = await FileSystem.getInfoAsync(filePath);
        if (!fileInfo.exists || fileInfo.size === 0) {
          throw new Error("File not properly written");
        }
  
        // Share the file
        const isShareAvailable = await Sharing.isAvailableAsync();
        if (!isShareAvailable) {
          throw new Error("Sharing is not available on this device");
        }
  
        // Use only supported sharing options
        await Sharing.shareAsync(filePath, {
          mimeType: "application/pdf",
          dialogTitle: "Your Health Report",
          UTI: Platform.OS === 'ios' ? "com.adobe.pdf" : undefined
        });
  
        // Clean up after successful share
        await FileSystem.deleteAsync(filePath, { idempotent: true });
  
        Alert.alert(
          "Success",
          "Your health report has been generated and shared successfully."
        );
      } catch (error) {
        console.error("File operation error:", error);
        let errorMessage = "Failed to process the PDF file.";
        
        if (error instanceof Error) {
          console.error('Detailed error:', error);
          errorMessage = error.message;
        }
        
        Alert.alert("Error", errorMessage);
      }
    } catch (error) {
      console.error("Export error:", error);
      Alert.alert(
        "Export Failed",
        error instanceof Error 
          ? error.message 
          : "Unable to generate health report. Please try again."
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
          onPress={() => router.push("/help")}
        />
        <SettingItem
          icon="information-circle-outline"
          label="About"
          onPress={() => router.push("/about")}
        />
        <SettingItem icon="exit" label="Logout" onPress={signOut} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
