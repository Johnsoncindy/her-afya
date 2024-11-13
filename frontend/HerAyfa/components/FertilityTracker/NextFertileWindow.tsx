import React from 'react';
import { format, differenceInDays } from 'date-fns';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';

interface NextFertileWindowProps {
  fertileWindowStart: Date | null;
  fertileWindowEnd: Date | null;
  nextOvulation: Date | null;
}

export const NextFertileWindow = ({
  fertileWindowStart,
  fertileWindowEnd,
  nextOvulation,
}: NextFertileWindowProps) => {
  const getDaysUntilFertileWindow = () => {
    if (!fertileWindowStart) return null;
    const today = new Date();
    const days = differenceInDays(fertileWindowStart, today);
    return days > 0 ? days : null;
  };

  const daysUntil = getDaysUntilFertileWindow();

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Next Fertile Window</ThemedText>
      {fertileWindowStart && fertileWindowEnd ? (
        <ThemedView style={styles.content}>
          <ThemedView style={styles.dateRow}>
            <Ionicons name="calendar" size={20} color="#4ECDC4" />
            <ThemedText style={styles.dateText}>
              {format(fertileWindowStart, 'MMM d')} - {format(fertileWindowEnd, 'MMM d, yyyy')}
            </ThemedText>
          </ThemedView>
          {nextOvulation && (
            <ThemedView style={styles.dateRow}>
              <Ionicons name="star" size={20} color="#45B7D1" />
              <ThemedText style={styles.dateText}>
                Ovulation: {format(nextOvulation, 'MMM d, yyyy')}
              </ThemedText>
            </ThemedView>
          )}
          {daysUntil !== null && (
            <ThemedView style={styles.countdown}>
              <ThemedText style={styles.daysText}>{daysUntil}</ThemedText>
              <ThemedText style={styles.daysLabel}>days until fertile window</ThemedText>
            </ThemedView>
          )}
        </ThemedView>
      ) : (
        <ThemedText style={styles.noDataText}>
          Start tracking your period to see fertility predictions
        </ThemedText>
      )}
    </ThemedView>
  );
};