import React, { useState } from "react";
import { Platform, Pressable, StyleSheet, useColorScheme } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format, subWeeks } from "date-fns";
import useUserStore from "@/store/userStore";
import { Colors } from "@/constants/Colors";
import { createPregnancyData } from "@/app/api/pregnancy/pregnancy";
import { calculateDueDate } from "./utils/pregnancyCalculations";
import HeartLoading from "../HeartLoading";

interface SetupPregnancyProps {
  onComplete: () => void;
}

export const SetupPregnancy = ({ onComplete }: SetupPregnancyProps) => {
  const [lastPeriodDate, setLastPeriodDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const userId = useUserStore.getState().user?.id ?? "";
  const [isLoading, setIsLoading] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleSetup = async () => {
    setIsLoading(true);
    try {
      await createPregnancyData({
        userId,
        lastPeriodDate,
        dueDate: calculateDueDate(lastPeriodDate),
        symptoms: [],
        appointments: [],
        weightEntries: [],
        kickCounts: [],
        checklist: [],
        memories: [],
      });
      onComplete();
    } catch (error) {
      console.error("Error setting up pregnancy data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const dynamicStyles = {
    container: {
      backgroundColor: isDark ? Colors.dark.background : Colors.light.background,
    },
    text: {
      color: isDark ? Colors.dark.text : Colors.light.text,
    },
    dateButton: {
      backgroundColor: isDark ? '#2C2C2E' : '#E5E7EB',
    },
    setupButton: {
      backgroundColor: isDark ? Colors.dark.tint : Colors.light.tint,
    }
  };

  return (
    <ThemedView style={[styles.container, dynamicStyles.container]}>
      <ThemedView style={styles.contentContainer}>
        <ThemedView style={styles.headerContainer}>
          <ThemedText style={[styles.title, dynamicStyles.text]}>
            Welcome to Your Pregnancy Journey!
          </ThemedText>
          <ThemedText style={[styles.description, dynamicStyles.text]}>
            Let's set up your pregnancy tracker. When was the first day of your last period?
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.inputContainer}>
          <Pressable
            style={[styles.dateButton, dynamicStyles.dateButton]}
            onPress={() => setShowDatePicker(true)}
          >
            <ThemedText style={[styles.dateText, dynamicStyles.text]}>
              {format(lastPeriodDate, "MMMM d, yyyy")}
            </ThemedText>
          </Pressable>

          {showDatePicker && (
            <DateTimePicker
              value={lastPeriodDate}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              maximumDate={new Date()}
              minimumDate={subWeeks(new Date(), 42)}
              onChange={(event, selectedDate) => {
                setShowDatePicker(Platform.OS === "ios");
                if (selectedDate) {
                  setLastPeriodDate(selectedDate);
                }
              }}
              textColor={isDark ? '#FFFFFF' : '#000000'}
              themeVariant={isDark ? 'dark' : 'light'}
            />
          )}
        </ThemedView>

        <Pressable 
          style={[styles.setupButton, dynamicStyles.setupButton]}
          onPress={handleSetup}
          disabled={isLoading}
        >
          <ThemedText style={styles.setupButtonText}>
            {isLoading ? <HeartLoading /> : "Start Tracking"}
          </ThemedText>
        </Pressable>
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 24,
    justifyContent: "space-between",
  },
  headerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.8,
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 32,
  },
  dateButton: {
    padding: 16,
    borderRadius: 12,
    width: "100%",
  },
  dateText: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "500",
  },
  setupButton: {
    padding: 16,
    borderRadius: 12,
    width: "100%",
  },
  setupButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
});