import {
    ScrollView,
    StyleSheet,
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import { Stack } from "expo-router";
  import { Colors } from "@/constants/Colors";
  import { useColorScheme } from "@/hooks/useColorScheme";
  import { ThemedView } from "@/components/ThemedView";
  import { getPeriodData } from "../api/period-tracker/period-tracker";
  import useUserStore from "@/store/userStore";
  import HeartLoading from "@/components/HeartLoading";
  import { ColorScheme } from "@/components/PeriodTracker/types";
  import { FertilityStatus } from "@/components/FertilityTracker/FertilityStatus";

import { ThemedText } from "@/components/ThemedText";
import { convertTimestampToDate } from "@/components/PeriodTracker/utils";
import { CycleCalendar } from "@/components/FertilityTracker/CycleCalendar";
import { NextFertileWindow } from "@/components/FertilityTracker/NextFertileWindow";
import { FertilityTips } from "@/components/FertilityTracker/FertilityTips";
  
  export default function FertilityTrackingScreen() {
    const colorScheme = useColorScheme() as ColorScheme;
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const userId = useUserStore.getState().user?.id ?? "";
  
    const [lastPeriodStart, setLastPeriodStart] = useState<Date | null>(null);
    const [nextOvulation, setNextOvulation] = useState<Date | null>(null);
    const [fertileWindowStart, setFertileWindowStart] = useState<Date | null>(null);
    const [fertileWindowEnd, setFertileWindowEnd] = useState<Date | null>(null);
    const [cycleLength, setCycleLength] = useState<number>(28);
  
    useEffect(() => {
      const fetchFertilityData = async () => {
        setIsLoading(true);
        try {
          const response = (await getPeriodData(userId)).data;
          console.log(response);
          
          const data = response.data;
          console.log(data);
          
          if (data) {
            const startDate = convertTimestampToDate(data.lastPeriodStart);
            setLastPeriodStart(startDate);
            
            if (startDate) {
              // Calculate fertility windows based on last period
              const avgCycleLength = data.insights?.averageCycleLength || 28;
              setCycleLength(avgCycleLength);
  
              // Typically ovulation occurs 14 days before the next period
              const ovulationDate = new Date(startDate);
              ovulationDate.setDate(startDate.getDate() + avgCycleLength - 14);
              setNextOvulation(ovulationDate);
  
              // Fertile window is typically 5 days before and 1 day after ovulation
              const fertileStart = new Date(ovulationDate);
              fertileStart.setDate(ovulationDate.getDate() - 5);
              setFertileWindowStart(fertileStart);
  
              const fertileEnd = new Date(ovulationDate);
              fertileEnd.setDate(ovulationDate.getDate() + 1);
              setFertileWindowEnd(fertileEnd);
            }
          }
        } catch (error: any) {
          if (error.response?.status !== 404) {
            setError('Something went wrong');
            console.error('Error fetching fertility data:', error);
          }
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchFertilityData();
    }, []);
  
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
            title: "Fertility Tracking",
            headerShadowVisible: false,
          }}
        />
  
        <ScrollView style={styles.content}>
          <FertilityStatus
            lastPeriodStart={lastPeriodStart}
            nextOvulation={nextOvulation}
            fertileWindowStart={fertileWindowStart}
            fertileWindowEnd={fertileWindowEnd}
          />
  
          <CycleCalendar
            lastPeriodStart={lastPeriodStart}
            nextOvulation={nextOvulation}
            fertileWindowStart={fertileWindowStart}
            fertileWindowEnd={fertileWindowEnd}
          />
  
          <NextFertileWindow
            fertileWindowStart={fertileWindowStart}
            fertileWindowEnd={fertileWindowEnd}
            nextOvulation={nextOvulation}
          />
  
          <FertilityTips cycleLength={cycleLength} />
  
          <ThemedText style={styles.disclaimer}>
            Note: Fertility predictions are estimates based on your cycle data. 
            For accurate fertility planning, please consult with a healthcare provider.
          </ThemedText>
        </ScrollView>
      </ThemedView>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      flex: 1,
      padding: 16,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    errorText: {
      fontSize: 16,
      color: '#ff0000',
      textAlign: 'center',
    },
    disclaimer: {
      fontSize: 12,
      opacity: 0.6,
      textAlign: 'center',
      marginTop: 16,
      marginBottom: 32,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    }
  });
