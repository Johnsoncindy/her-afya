import React from 'react';
import { Calendar } from 'react-native-calendars';
import { format } from 'date-fns';
import { ColorScheme } from '@/components/PeriodTracker/types';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { styles } from './styles';

interface CycleCalendarProps {
  lastPeriodStart: Date | null;
  nextOvulation: Date | null;
  fertileWindowStart: Date | null;
  fertileWindowEnd: Date | null;
}

export const CycleCalendar = ({
  lastPeriodStart,
  nextOvulation,
  fertileWindowStart,
  fertileWindowEnd,
}: CycleCalendarProps) => {
  const colorScheme = useColorScheme() as ColorScheme;

  const generateMarkedDates = () => {
    const markedDates: any = {};

    if (lastPeriodStart) {
      markedDates[format(lastPeriodStart, 'yyyy-MM-dd')] = {
        startingDay: true,
        color: '#FF6B6B',
        textColor: 'white',
      };
    }

    if (fertileWindowStart && fertileWindowEnd) {
      let currentDate = new Date(fertileWindowStart);
      while (currentDate <= fertileWindowEnd) {
        const dateString = format(currentDate, 'yyyy-MM-dd');
        markedDates[dateString] = {
          startingDay: currentDate.getTime() === fertileWindowStart.getTime(),
          endingDay: currentDate.getTime() === fertileWindowEnd.getTime(),
          color: '#4ECDC4',
          textColor: 'white',
        };
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    if (nextOvulation) {
      markedDates[format(nextOvulation, 'yyyy-MM-dd')] = {
        color: '#45B7D1',
        textColor: 'white',
        marked: true,
      };
    }

    return markedDates;
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Fertility Calendar</ThemedText>
      <Calendar
        markingType={'period'}
        markedDates={generateMarkedDates()}
        theme={{
          calendarBackground: colorScheme === 'dark' ? '#1A1A1A' : 'white',
          textColor: colorScheme === 'dark' ? 'white' : 'black',
          monthTextColor: colorScheme === 'dark' ? 'white' : 'black',
          dayTextColor: colorScheme === 'dark' ? 'white' : 'black',
        }}
      />
      <ThemedView style={styles.legend}>
        <ThemedView style={styles.legendItem}>
          <ThemedView style={[styles.dot, { backgroundColor: '#FF6B6B' }]} />
          <ThemedText style={styles.legendText}>Period</ThemedText>
        </ThemedView>
        <ThemedView style={styles.legendItem}>
          <ThemedView style={[styles.dot, { backgroundColor: '#4ECDC4' }]} />
          <ThemedText style={styles.legendText}>Fertile Window</ThemedText>
        </ThemedView>
        <ThemedView style={styles.legendItem}>
          <ThemedView style={[styles.dot, { backgroundColor: '#45B7D1' }]} />
          <ThemedText style={styles.legendText}>Ovulation</ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
};
