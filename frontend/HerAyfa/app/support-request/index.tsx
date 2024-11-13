import React, { useState } from "react";
import {
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Switch,
  SafeAreaView,
  Alert,
  Modal,
  Platform,
  StatusBar,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { router } from "expo-router";
import useUserStore from "@/store/userStore";
import HeartLoading from "@/components/HeartLoading";
import { createSupportRequest } from "../api/support/support";
type SupportType = "emotional" | "resources" | "guidance" | "companionship";

interface SupportRequestData {
  id?: string;
  title: string;
  description: string;
  type: "emotional" | "resources" | "guidance" | "companionship";
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  isEmergency: boolean;
  anonymous: boolean;
  userId: string;
}

const SupportRequestScreen: React.FC<SupportRequestData> = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const userId = useUserStore.getState().user?.id;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<SupportRequestData>({
    title: "",
    description: "",
    type: "emotional",
    location: {
      latitude: 0,
      longitude: 0,
      address: "",
    },
    isEmergency: false,
    anonymous: false,
    userId: userId ? userId : "",
  });

  const supportTypes: SupportType[] = [
    "emotional",
    "resources",
    "guidance",
    "companionship",
  ];

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
  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      Alert.alert("Error", "Please enter a title for your request");
      return;
    }
    if (!formData.description.trim()) {
      Alert.alert("Error", "Please describe what kind of support you need");
      return;
    }
    if (!formData.location.address) {
      Alert.alert("Error", "Please enter your location");
      return;
    }

    // Start loading
    setLoading(true);

    try {
      await createSupportRequest(formData);
      // Reset form data
      setFormData({
        title: "",
        description: "",
        type: "emotional",
        location: {
          latitude: 0,
          longitude: 0,
          address: "",
        },
        isEmergency: false,
        anonymous: false,
        userId: userId ? userId : "",
      });
    } catch (error) {
      console.error(error);
    } finally {
      // Stop loading
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <TabBarIcon name="arrow-back-circle" color={colors.text} size={24} />
        </Pressable>
        <ThemedText style={styles.headerText}>
          {formData.isEmergency
            ? "🚨 Emergency Support Request"
            : "Create Support Request"}
        </ThemedText>
      </ThemedView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.formContent}>
          {/* Support Type Selection */}
          <ThemedText style={styles.label}>Type of Support Needed</ThemedText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.typeContainer}
          >
            {supportTypes.map((type) => (
              <Pressable
                key={type}
                style={[
                  styles.typeChip,
                  {
                    backgroundColor:
                      formData.type === type ? colors.tint : colors.background,
                    borderColor: colors.tint,
                  },
                ]}
                onPress={() => setFormData({ ...formData, type })}
              >
                <FontAwesome5
                  name={getTypeIcon(type)}
                  color={formData.type === type ? "#FFFFFF" : colors.text}
                  size={16}
                />
                <ThemedText
                  style={[
                    styles.typeText,
                    { color: formData.type === type ? "#FFFFFF" : colors.text },
                  ]}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </ThemedText>
              </Pressable>
            ))}
          </ScrollView>

          {/* Title Input */}
          <ThemedText style={styles.label}>Title</ThemedText>
          <TextInput
            style={[
              styles.input,
              { color: colors.text, borderColor: colors.tabIconDefault },
            ]}
            value={formData.title}
            onChangeText={(title) => setFormData({ ...formData, title })}
            placeholder="Brief title for your request"
            placeholderTextColor={colors.tabIconDefault}
          />

          {/* Description Input */}
          <ThemedText style={styles.label}>Description</ThemedText>
          <TextInput
            style={[
              styles.textArea,
              { color: colors.text, borderColor: colors.tabIconDefault },
            ]}
            value={formData.description}
            onChangeText={(description) =>
              setFormData({ ...formData, description })
            }
            placeholder="Describe what kind of support you need..."
            placeholderTextColor={colors.tabIconDefault}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          {/* Location Input */}
          <ThemedText style={styles.label}>Location</ThemedText>
          <Pressable
            onPress={() => setLocationModalVisible(true)}
            style={[styles.input, { justifyContent: "center" }]}
          >
            <ThemedText
              style={{
                color: formData.location.address
                  ? colors.text
                  : colors.tabIconDefault,
              }}
            >
              {formData.location.address || "Tap to select your location"}
            </ThemedText>
          </Pressable>

          {/* Emergency Toggle */}
          <ThemedView style={styles.toggleContainer}>
            <ThemedText style={styles.toggleLabel}>
              Emergency Request
            </ThemedText>
            <Switch
              value={formData.isEmergency}
              onValueChange={(value) =>
                setFormData({ ...formData, isEmergency: value })
              }
              trackColor={{ false: colors.tabIconDefault, true: "#FF4444" }}
              thumbColor={formData.isEmergency ? "#FF0000" : "#f4f3f4"}
            />
          </ThemedView>

          {/* Anonymous Toggle */}
          <ThemedView style={styles.toggleContainer}>
            <ThemedText style={styles.toggleLabel}>Stay Anonymous</ThemedText>
            <Switch
              value={formData.anonymous}
              onValueChange={(value) =>
                setFormData({ ...formData, anonymous: value })
              }
              trackColor={{ false: colors.tabIconDefault, true: colors.tint }}
              thumbColor={formData.anonymous ? colors.tint : "#f4f3f4"}
            />
          </ThemedView>

          {/* Submit Button */}
          <Pressable
            style={[styles.submitButton, { backgroundColor: colors.tint }]}
            onPress={handleSubmit}
          >
            <ThemedText style={styles.submitButtonText}>
              {loading ? <HeartLoading /> : "Submit Request"}
            </ThemedText>
          </Pressable>
        </ThemedView>
      </ScrollView>

      <Modal
        visible={locationModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setLocationModalVisible(false)}
      >
        <GooglePlacesAutocomplete
          placeholder="Search for a location"
          onPress={(data, details = null) => {
            // Extract latitude and longitude from details
            const { lat, lng } = details?.geometry?.location || {};
            setFormData({
              ...formData,
              location: {
                latitude: lat || 0,
                longitude: lng || 0,
                address: data.description,
              },
            });
            setLocationModalVisible(false);
          }}
          query={{
            key: process.env.EXPO_PUBLIC_GOOGLE_API_KEY,
            language: "en",
          }}
          fetchDetails={true}
          styles={{
            container: {
              padding: 10,
            },
            textInputContainer: {
              width: "100%",
              borderWidth: 1,
              borderColor: colors.tabIconDefault,
              borderRadius: 8,
              marginTop: 15,
            },
            textInput: {
              height: 44,
              color: "black",
              fontSize: 16,
            },
          }}
        />

        <Pressable
          onPress={() => setLocationModalVisible(false)}
          style={styles.closeModalButton}
        >
          <ThemedText style={{ color: colors.tint }}>Close</ThemedText>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};
export default SupportRequestScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  formContent: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
  },
  typeContainer: {
    flexDirection: "row",
    marginBottom: 8,
  },
  typeChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  typeText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "500",
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    paddingVertical: 8,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  submitButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 24,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  closeModalButton: {
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});
