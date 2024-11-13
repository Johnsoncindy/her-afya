import React, { useEffect, useState } from 'react';
import { Alert, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import useUserStore from '@/store/userStore';
import HeartLoading from '@/components/HeartLoading';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { WeekProgress } from '@/components/PregnancyJourney/WeekProgress';
import { DevelopmentMilestones } from '@/components/PregnancyJourney/DevelopmentMilestones';
import { SymptomTracker } from '@/components/PregnancyJourney/SymptomTracker';
import { AppointmentTracker } from '@/components/PregnancyJourney/AppointmentTracker';
import { WeightTracker } from '@/components/PregnancyJourney/WeightTracker';
import { ThemedText } from '@/components/ThemedText';
import { ColorScheme } from '@/components/PeriodTracker/types';
import { KickCounter } from '@/components/PregnancyJourney/KickCounter';
import { PregnancyChecklist } from '@/components/PregnancyJourney/PregnancyChecklist';
import { Memories } from '@/components/PregnancyJourney/Memories';
import { styles } from '@/components/PregnancyJourney/styles';
import { Appointment, ChecklistItem, KickCount, Memory, PregnancyData, PregnancySymptom, WeightEntry } from '@/components/PregnancyJourney/types';
import { getCurrentWeek, getTrimesters } from '@/components/PregnancyJourney/utils/pregnancyCalculations';
import { SetupPregnancy } from '@/components/PregnancyJourney/SetupPregnancy';
import { addAppointment, addKickCount, addMemory, addSymptom, addWeight, getPregnancyData, updateChecklist } from '../api/pregnancy/pregnancy';

export default function PregnancyJourneyScreen() {
  const colorScheme = useColorScheme() as ColorScheme;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const userId = useUserStore.getState().user?.id ?? "";
  const [pregnancyData, setPregnancyData] = useState<PregnancyData | null>(null);

  useEffect(() => {
    fetchPregnancyData();
  }, [userId]);

  const handleAddSymptom = async (symptom: PregnancySymptom) => {
    setIsLoading(true);
    try {
      await addSymptom(userId, symptom);
      // Update local state
      setPregnancyData(prev => prev ? {
        ...prev,
        symptoms: [...prev.symptoms, symptom]
      } : null);
    } catch (error) {
      console.error('Error adding symptom:', error);
      Alert.alert('Error', 'Failed to add symptom');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddAppointment = async (appointment: Appointment) => {
    setIsLoading(true);
    try {
      await addAppointment(userId, appointment);
      // Update local state and sort appointments by date
      setPregnancyData(prev => prev ? {
        ...prev,
        appointments: [...prev.appointments, appointment].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        )
      } : null);
    } catch (error) {
      console.error('Error adding appointment:', error);
      Alert.alert('Error', 'Failed to add appointment');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddWeight = async (weight: WeightEntry) => {
    setIsLoading(true);
    try {
      await addWeight(userId, weight);
      // Update local state and sort entries by date
      setPregnancyData(prev => prev ? {
        ...prev,
        weightEntries: [...prev.weightEntries, weight].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        )
      } : null);
    } catch (error) {
      console.error('Error adding weight:', error);
      Alert.alert('Error', 'Failed to add weight entry');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddKickCount = async (kickCount: KickCount) => {
    setIsLoading(true);
    try {
      await addKickCount(userId, kickCount);
      // Update local state
      setPregnancyData(prev => prev ? {
        ...prev,
        kickCounts: [...prev.kickCounts, kickCount]
      } : null);
    } catch (error) {
      console.error('Error adding kick count:', error);
      Alert.alert('Error', 'Failed to add kick count');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUpdateChecklist = async (checklist: ChecklistItem[]) => {
    setIsLoading(true);
    try {
      await updateChecklist(userId, checklist);
      // Update local state
      setPregnancyData(prev => prev ? {
        ...prev,
        checklist
      } : null);
    } catch (error) {
      console.error('Error updating checklist:', error);
      Alert.alert('Error', 'Failed to update checklist');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddMemory = async (memory: Memory) => {
    setIsLoading(true);
    try {
      await addMemory(userId, {
        ...memory,
        date: new Date(),
      });
  
      // Update local state with the complete memory object
      setPregnancyData(prev => prev ? {
        ...prev,
        memories: [...prev.memories, {
          ...memory,
          date: new Date(),
        }]
      } : null);
  
    } catch (error) {
      console.error('Error adding memory:', error);
      Alert.alert('Error', 'Failed to add memory');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPregnancyData = async () => {
     setIsLoading(true);
    try {
      const response = (await getPregnancyData(userId)).data;
    
      setPregnancyData(response.data);
    } catch (error: any) {
      if (error.response?.status !== 404) {
        setError('Something went wrong');
        console.error('Error fetching pregnancy data:', error);
      }
    } finally {
      setIsLoading(false);
    } 
  };

  if (isLoading) {
    return <HeartLoading size={40} color={Colors[colorScheme].tint} />;
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
        <SetupPregnancy onComplete={fetchPregnancyData} />
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

        <DevelopmentMilestones 
          currentWeek={currentWeek}
        />

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

