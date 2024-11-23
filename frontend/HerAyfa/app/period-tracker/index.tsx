import { ScrollView, Pressable, Alert, Platform } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { useState, useEffect } from "react";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import * as Calendar from "expo-calendar";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { format, addDays, addMonths, differenceInDays } from "date-fns";
import { styles } from "@/components/PeriodTracker/Styles";
import { StatusCard } from "@/components/PeriodTracker/StatusCard";
import { CycleHistory } from "@/components/PeriodTracker/CycleHistory";
import { SymptomTracker } from "@/components/PeriodTracker/SymptomTracker";
import { Insights } from "@/components/PeriodTracker/Insights";
import {
  calculateAndCreateEvents,
  calculateCycleInsights,
  convertTimestampToDate,
  getEventColor,
  getEventNotes,
  getEventTitle,
} from "@/components/PeriodTracker/utils";
import {
  ColorScheme,
  CycleData,
  EventType,
  Symptom,
  SymptomId,
  SymptomName,
  SYMPTOMS,
  SymptomType,
} from "@/components/PeriodTracker/types";
import { AddSymptomModal } from "@/components/PeriodTracker/AddSymptomModal";
import { CalendarInfo } from "@/components/PeriodTracker/CalendarInfo";
import {
  getPeriodData,
  createOrUpdatePeriodData,
  addCycleData,
  addSymptom,
  updateInsights,
} from "../api/period-tracker/period-tracker";
import useUserStore from "@/store/userStore";
import HeartLoading from "@/components/HeartLoading";
import { usePeriodStore } from "@/store/periodStore";
import { handlePeriodData } from "@/components/PeriodTracker/handlePeriodData";

export default function PeriodTrackerScreen() {
  const colorScheme = useColorScheme() as ColorScheme;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const userId = useUserStore.getState().user?.id ?? "";
  // Calendar states
  const [calendarId, setCalendarId] = useState<string | null>(null);
  const [hasCalendarPermission, setHasCalendarPermission] = useState(false);

  // Period tracking states
  const [lastPeriodStart, setLastPeriodStart] = useState<Date | null>(null);
  const [nextPeriodDate, setNextPeriodDate] = useState<Date | null>(null);
  const [periodEndDate, setPeriodEndDate] = useState<Date | null>(null);
  const [cycleHistory, setCycleHistory] = useState<CycleData[]>([]);

  // Date picker states
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  // Symptom states
  const [selectedSymptoms, setSelectedSymptoms] = useState<Symptom[]>([]);
  const [selectedSymptomTemp, setSelectedSymptomTemp] =
    useState<SymptomType | null>(null);
  const [showSymptomModal, setShowSymptomModal] = useState(false);
  const [showSymptomDatePicker, setShowSymptomDatePicker] = useState(false);
  const [selectedSymptomDate, setSelectedSymptomDate] = useState(new Date());

  // Insights states
  const [averageCycleLength, setAverageCycleLength] = useState<number | null>(
    null
  );
  const [cycleVariation, setCycleVariation] = useState<number | null>(null);

  useEffect(() => {
    requestCalendarPermissions();
  }, []);

  useEffect(() => {
    if (hasCalendarPermission) {
      setupCalendar();
    }
  }, [hasCalendarPermission]);

  useEffect(() => {
    if (lastPeriodStart && calendarId) {
      handleCreateEvents();
    }
  }, []);

  useEffect(() => {
    // Type guard to validate period data structure
const isPeriodDataValid = (data: any): boolean => {
  return (
    data &&
    typeof data === 'object' &&
    'lastPeriodStart' in data &&
    'periodEndDate' in data &&
    'cycleHistory' in data &&
    Array.isArray(data.cycleHistory)
  );
};

// Helper function to safely convert Firestore timestamp to Date
const safeTimestampToDate = (timestamp: any): Date | null => {
  if (!timestamp) return null;
  
  // Handle Firestore timestamp format
  if (timestamp._seconds !== undefined && timestamp._nanoseconds !== undefined) {
    return new Date(timestamp._seconds * 1000);
  }
  
  // Handle regular date strings or timestamps
  if (timestamp instanceof Date || typeof timestamp === 'string' || typeof timestamp === 'number') {
    return new Date(timestamp);
  }
  
  return null;
};

// Updated fetchPeriodData function
const fetchPeriodData = async () => {
  setIsLoading(true);
  try {
    const response = (await getPeriodData(userId)).data;
    const data = response.data;

    if (!isPeriodDataValid(data)) {
      console.error('Invalid data structure:', data);
      throw new Error('Invalid data structure received from server');
    }

    // Safely convert timestamps
    const startDate = safeTimestampToDate(data.lastPeriodStart);
    const endDate = safeTimestampToDate(data.periodEndDate);

    setLastPeriodStart(startDate);
    setPeriodEndDate(endDate);

    // Safely process cycle history
    const processedCycleHistory = data.cycleHistory.map((cycle: any) => {
      // Validate cycle data
      if (!cycle || typeof cycle !== 'object') {
        console.warn('Invalid cycle data:', cycle);
        return null;
      }

      return {
        startDate: safeTimestampToDate(cycle.startDate) || new Date(),
        endDate: safeTimestampToDate(cycle.endDate) || new Date(),
        length: cycle.length || 0,
        symptoms: Array.isArray(cycle.symptoms)
          ? cycle.symptoms.map((symptom: any) => ({
              id: symptom.id as SymptomId,
              name: symptom.name as SymptomName,
              intensity: Math.min(Math.max(1, Number(symptom.intensity)), 3) as 1 | 2 | 3,
              date: safeTimestampToDate(symptom.date) || new Date(),
            }))
          : [],
      };
    }).filter(Boolean); // Remove any null entries

    setCycleHistory(processedCycleHistory);

    // Process symptoms across all cycles
    const allSymptoms = processedCycleHistory
      .flatMap((cycle: CycleData) => cycle?.symptoms || [])
      .filter((symptom: Symptom) => 
        symptom && 
        typeof symptom === 'object' && 
        'id' in symptom && 
        'name' in symptom && 
        'intensity' in symptom && 
        'date' in symptom
      );

    setSelectedSymptoms(allSymptoms);

    // Safely process insights
    if (data.insights && typeof data.insights === 'object') {
      setAverageCycleLength(Number(data.insights.averageCycleLength) || null);
      setCycleVariation(Number(data.insights.cycleVariation) || null);
    }
  } catch (error: any) {
    if (error.response?.status !== 404) {
      setError("Error loading period data. Please try again.");
      console.error("Error fetching period data:", error);
    }
  } finally {
    setIsLoading(false);
  }
};
  
    fetchPeriodData();
  }, []);

  useEffect(() => {
    if (cycleHistory.length >= 2) {
      const { averageCycleLength: avgLength, cycleVariation: variation } =
        calculateCycleInsights(cycleHistory);

      const updateInsightsData = async () => {
        setIsLoading(true);
        try {
          await updateInsights({
            userId,
            insights: {
              averageCycleLength: avgLength,
              cycleVariation: variation,
            },
          });
          setAverageCycleLength(avgLength);
          setCycleVariation(variation);
        } catch (error) {
          setError("Something went wrong");
          console.error("Error updating insights:", error);
        } finally {
          setIsLoading(false);
        }
      };

      updateInsightsData();
    }
  }, []);

  const requestCalendarPermissions = async () => {
    try {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      setHasCalendarPermission(status === "granted");
      if (status !== "granted") {
        Alert.alert(
          "Permissions Required",
          "Calendar permissions are needed to track your cycle"
        );
      }
    } catch (error) {
      console.error("Error requesting calendar permissions:", error);
    }
  };

  const setupCalendar = async () => {
    try {
      const calendars = await Calendar.getCalendarsAsync(
        Calendar.EntityTypes.EVENT
      );
      const periodCalendar = calendars.find(
        (cal) => cal.title === "Period Tracker"
      );

      const id =
        periodCalendar?.id ??
        (await Calendar.createCalendarAsync({
          title: "Period Tracker",
          color: Colors[colorScheme].tint,
          entityType: Calendar.EntityTypes.EVENT,
          sourceId: calendars[0]?.source.id,
          source: calendars[0]?.source,
          name: "PeriodTrackerCalendar",
          ownerAccount: "personal",
          accessLevel: Calendar.CalendarAccessLevel.OWNER,
        }));

      setCalendarId(id);
    } catch (error) {
      console.error("Error setting up calendar:", error);
    }
  };

  const handleCreateEvents = async () => {
    if (!lastPeriodStart || !calendarId) return;
    try {
      await calculateAndCreateEvents(
        lastPeriodStart,
        calendarId,
        (type) => getEventColor(type as EventType, colorScheme),
        getEventTitle,
        getEventNotes
      );
      setNextPeriodDate(addDays(lastPeriodStart, 28));
    } catch (error) {
      console.error("Error creating events:", error);
    }
  };
  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setSelectedDate(selectedDate);
    }
  };

  const handleSetPeriodStart = async () => {
    Alert.alert(
      "Set Period Start Date",
      `Are you sure you want to set your period start date to ${format(
        selectedDate,
        "MMMM d, yyyy"
      )}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            setIsLoading(true);
            try {
              // First create/update with just the start date
              await createOrUpdatePeriodData({
                userId,
                lastPeriodStart: selectedDate,
                periodEndDate: null,
                cycleHistory,
                insights: {
                  averageCycleLength: averageCycleLength || 0,
                  cycleVariation: cycleVariation || 0,
                },
              });
              setLastPeriodStart(selectedDate);

              // Ask if they want to set end date now or later
              Alert.alert(
                "Period End Date",
                "Do you want to set the end date now?",
                [
                  {
                    text: "Set Later",
                    style: "cancel",
                  },
                  {
                    text: "Set Now",
                    onPress: () => setShowEndDatePicker(true),
                  },
                ]
              );
            } catch (error) {
              console.error("Error updating period start:", error);
              Alert.alert("Error", "Failed to update period start date");
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleSetPeriodEnd = async (
    event: DateTimePickerEvent,
    date?: Date
  ) => {
    setShowEndDatePicker(Platform.OS === "ios");
    if (date && lastPeriodStart) {
      setIsLoading(true);
      try {
        // Update period data with end date
        await createOrUpdatePeriodData({
          userId,
          lastPeriodStart,
          periodEndDate: date,
          cycleHistory,
          insights: {
            averageCycleLength: averageCycleLength || 0,
            cycleVariation: cycleVariation || 0,
          },
        });

        setPeriodEndDate(date);

        // Only add to cycle history when period is complete
        await addCycleToHistory(lastPeriodStart, date);
      } catch (error) {
        console.error("Error updating period data:", error);
        Alert.alert("Error", "Failed to update period data");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const addCycleToHistory = async (startDate: Date, endDate: Date) => {
    const newCycle: CycleData = {
      startDate,
      endDate,
      length: differenceInDays(endDate, startDate),
      symptoms: selectedSymptoms.filter(
        (symptom) => symptom.date >= startDate && symptom.date <= endDate
      ),
    };
    setIsLoading(true);
    try {
      await addCycleData({
        userId,
        cycleData: newCycle,
      });
      setCycleHistory((prev) => [...prev, newCycle]);
    } catch (error) {
      console.error("Error adding cycle:", error);
      Alert.alert("Error", "Failed to add cycle data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSymptomSelect = (symptom: SymptomType) => {
    setSelectedSymptomTemp(symptom);
    setShowSymptomDatePicker(true);
  };

  const handleSymptomDateChange = (event: DateTimePickerEvent, date?: Date) => {
    setShowSymptomDatePicker(Platform.OS === "ios");
    if (date && selectedSymptomTemp) {
      setSelectedSymptomDate(date);
      Alert.alert(
        "Select Intensity",
        `How intense is your ${selectedSymptomTemp.name.toLowerCase()}?`,
        [
          {
            text: "Mild",
            onPress: () => handleSymptomAdd(selectedSymptomTemp.id, 1),
          },
          {
            text: "Moderate",
            onPress: () => handleSymptomAdd(selectedSymptomTemp.id, 2),
          },
          {
            text: "Severe",
            onPress: () => handleSymptomAdd(selectedSymptomTemp.id, 3),
          },
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => setSelectedSymptomTemp(null),
          },
        ]
      );
    }
  };

  const handleSymptomAdd = async (
    symptomId: SymptomId,
    intensity: 1 | 2 | 3
  ) => {
    const symptom = SYMPTOMS.find((s) => s.id === symptomId);
    if (symptom) {
      const newSymptom = {
        id: symptom.id,
        name: symptom.name,
        intensity,
        date: selectedSymptomDate,
      };
      setIsLoading(true);
      try {
        await addSymptom({
          userId,
          symptom: newSymptom,
          cycleIndex: cycleHistory.length - 1, // Assuming adding to latest cycle
        });

        setSelectedSymptoms((prev) => [...prev, newSymptom]);
        setShowSymptomModal(false);
        setSelectedSymptomTemp(null);
      } catch (error) {
        console.error("Error adding symptom:", error);
        Alert.alert("Error", "Failed to add symptom");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <HeartLoading size={80} color={Colors[colorScheme].secondary} />
      </ThemedView> 
    )
  }
  if (error) {
    return (
      <ThemedView style={styles.errorContainer}>
        <ThemedText style={styles.errorText}>{error}</ThemedText>
      </ThemedView>
    );
  }
  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Period Tracker",
          headerShadowVisible: false,
        }}
      />

      <ScrollView style={styles.content}>
        <StatusCard
          lastPeriodStart={lastPeriodStart}
          periodEndDate={periodEndDate}
          nextPeriodDate={nextPeriodDate}
          onSetEndDate={() => setShowEndDatePicker(true)}
        />
        <CycleHistory cycles={cycleHistory} />
        <SymptomTracker
          symptoms={selectedSymptoms}
          onAddSymptom={() => setShowSymptomModal(true)}
        />

        <Insights
          averageCycleLength={averageCycleLength}
          cycleVariation={cycleVariation}
          cycleCount={cycleHistory.length}
        />

        <ThemedView style={styles.datePickerContainer}>
          <ThemedText style={styles.datePickerLabel}>
            {isLoading ? <HeartLoading /> : "Set Period Start Date"}
          </ThemedText>
          <Pressable
            style={[
              styles.datePicker,
              { backgroundColor: Colors[colorScheme ?? "light"].tint },
              isLoading && styles.disabledButton,
            ]}
            onPress={showDatepicker}
          >
            <Ionicons
              name="calendar"
              size={20}
              color="#FFFFFF"
              style={styles.datePickerIcon}
            />
            <ThemedText style={styles.datePickerText}>
              {format(selectedDate, "MMMM d, yyyy")}
            </ThemedText>
          </Pressable>

          {showDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={selectedDate}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleDateChange}
              maximumDate={new Date()}
              minimumDate={addMonths(new Date(), -3)}
            />
          )}
          {showEndDatePicker && (
            <DateTimePicker
              testID="endDatePicker"
              value={periodEndDate || lastPeriodStart || new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleSetPeriodEnd}
              minimumDate={lastPeriodStart || undefined}
              maximumDate={new Date()}
            />
          )}
        </ThemedView>

        <CalendarInfo />

        <Pressable
          style={[
            styles.button,
            { backgroundColor: Colors[colorScheme ?? "light"].tint },
          ]}
          onPress={handleSetPeriodStart}
          disabled={isLoading}
        >
          <ThemedText style={styles.buttonText}>
            Set Period Start Date
          </ThemedText>
        </Pressable>

        <ThemedText style={styles.disclaimer}>
          Note: Predictions are based on average cycle lengths and may vary.
          Please consult with a healthcare provider for medical advice.
        </ThemedText>
      </ScrollView>
      <AddSymptomModal
        visible={showSymptomModal}
        onClose={() => setShowSymptomModal(false)}
        onSelectSymptom={handleSymptomSelect}
        showDatePicker={showSymptomDatePicker}
        selectedDate={selectedSymptomDate}
        onDateChange={handleSymptomDateChange}
      />

      {showEndDatePicker && (
        <DateTimePicker
          testID="endDatePicker"
          value={periodEndDate || lastPeriodStart || new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleSetPeriodEnd}
          minimumDate={lastPeriodStart || undefined}
          maximumDate={new Date()}
        />
      )}
    </ThemedView>
  );
}