import React, { useEffect } from "react";
import { Alert, ScrollView } from "react-native";
import { Stack } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import useUserStore from "@/store/userStore";
import HeartLoading from "@/components/HeartLoading";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { WeekProgress } from "@/components/PregnancyJourney/WeekProgress";
import { DevelopmentMilestones } from "@/components/PregnancyJourney/DevelopmentMilestones";
import { SymptomTracker } from "@/components/PregnancyJourney/SymptomTracker";
import { AppointmentTracker } from "@/components/PregnancyJourney/AppointmentTracker";
import { WeightTracker } from "@/components/PregnancyJourney/WeightTracker";
import { ThemedText } from "@/components/ThemedText";
import { ColorScheme } from "@/components/PeriodTracker/types";
import { KickCounter } from "@/components/PregnancyJourney/KickCounter";
import { PregnancyChecklist } from "@/components/PregnancyJourney/PregnancyChecklist";
import { Memories } from "@/components/PregnancyJourney/Memories";
import { styles } from "@/components/PregnancyJourney/styles";
import {
  Appointment,
  ChecklistItem,
  KickCount,
  Memory,
  PregnancySymptom,
  WeightEntry,
} from "@/components/PregnancyJourney/types";
import {
  getCurrentWeek,
  getTrimesters,
} from "@/components/PregnancyJourney/utils/pregnancyCalculations";
import { SetupPregnancy } from "@/components/PregnancyJourney/SetupPregnancy";
import { usePregnancyStore } from "@/store/pregnancyStore";

export default function PregnancyJourneyScreen() {
  const colorScheme = useColorScheme() as ColorScheme;
  const userId = useUserStore.getState().user?.id ?? "";

  const {
    pregnancyData,
    loading,
    error,
    fetchPregnancyData,
    addSymptom,
    addAppointment,
    addWeight,
    addKickCount,
    updateChecklist,
    addMemory,
  } = usePregnancyStore();

  useEffect(() => {
    fetchPregnancyData(userId);
  }, [userId]);

  const handleAddSymptom = async (symptom: PregnancySymptom) => {
    try {
      await addSymptom(userId, symptom);
      Alert.alert("Success", "Symptom added successfully");
    } catch (error) {
      console.error("Error adding symptom:", error);
      Alert.alert("Error", "Failed to add symptom");
    }
  };

  const handleAddAppointment = async (appointment: Appointment) => {
    try {   
      await addAppointment(userId, appointment);
      Alert.alert("Success", "Appointment added successfully");
    } catch (error) {
      console.error("Error adding appointment:", error);
      Alert.alert("Error", "Failed to add appointment");
    }
  };

  const handleAddWeight = async (weight: WeightEntry) => {
    try {
      await addWeight(userId, weight);
      Alert.alert("Success", "Weight entry added successfully");
    } catch (error) {
      console.error("Error adding weight:", error);
      Alert.alert("Error", "Failed to add weight entry");
    }
  };

  const handleAddKickCount = async (kickCount: KickCount) => {
    try {
      await addKickCount(userId, kickCount);
    } catch (error) {
      console.error("Error adding kick count:", error);
      Alert.alert("Error", "Failed to add kick count");
    }
  };

  const handleUpdateChecklist = async (checklist: ChecklistItem[]) => {
    try {
      await updateChecklist(userId, checklist);
      Alert.alert("Success", "Checklist updated successfully");
    } catch (error) {
      console.error("Error updating checklist:", error);
      Alert.alert("Error", "Failed to update checklist");
    }
  };

  const handleAddMemory = async (memory: Memory) => {
    try {
      await addMemory(userId, {
        ...memory,
        date: new Date(),
      });
      Alert.alert("Success", "Memory added successfully");
    } catch (error) {
      console.error("Error adding memory:", error);
      Alert.alert("Error", "Failed to add memory");
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <HeartLoading size={80} color={Colors[colorScheme].secondary} />
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.errorContainer}>
        <ThemedText style={styles.errorText}>{error}</ThemedText>
      </ThemedView>
    );
  }

  if (!pregnancyData) {
    return (
      <ThemedView style={styles.container}>
        <Stack.Screen
          options={{
            headerShown: true,
            title: "Pregnancy Journey",
            headerShadowVisible: false,
          }}
        />
        <SetupPregnancy onComplete={() => fetchPregnancyData(userId)} />
      </ThemedView>
    );
  }

  const currentWeek = getCurrentWeek(pregnancyData.lastPeriodDate);
  const { trimester, weekInTrimester } = getTrimesters(currentWeek);
 
  
  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Pregnancy Journey",
          headerShadowVisible: false,
        }}
      />

      <ScrollView style={styles.content}>
        <WeekProgress
          currentWeek={currentWeek}
          trimester={trimester}
          weekInTrimester={weekInTrimester}
          dueDate={pregnancyData.dueDate}
        />

        <DevelopmentMilestones currentWeek={currentWeek} />

        <SymptomTracker
          symptoms={pregnancyData.symptoms}
          onAddSymptom={handleAddSymptom}
        />

        <AppointmentTracker
          appointments={pregnancyData.appointments}
          onAddAppointment={handleAddAppointment}
        />

        <WeightTracker
          weightEntries={pregnancyData.weightEntries}
          onAddWeight={handleAddWeight}
        />

        <KickCounter
          kickCounts={pregnancyData.kickCounts}
          onAddKickCount={handleAddKickCount}
        />

        <PregnancyChecklist
          checklist={pregnancyData.checklist}
          onUpdateChecklist={handleUpdateChecklist}
        />

        <Memories
          memories={pregnancyData.memories}
          onAddMemory={handleAddMemory}
        />
      </ScrollView>
    </ThemedView>
  );
}
