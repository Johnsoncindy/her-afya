import React from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';

interface FertilityTipsProps {
  cycleLength: number;
}

export const FertilityTips = ({ cycleLength }: FertilityTipsProps) => {
  const tips = [
    {
      icon: 'calendar',
      title: 'Track Your Cycle',
      description: `Your average cycle length is ${cycleLength} days. Regular tracking helps predict fertility windows more accurately.`,
    },
    {
      icon: 'thermometer',
      title: 'Basal Body Temperature',
      description: 'Track your morning temperature before getting out of bed for more accurate ovulation prediction.',
    },
    {
      icon: 'water',
      title: 'Monitor Cervical Mucus',
      description: 'Changes in cervical mucus can indicate your most fertile days.',
    },
    {
      icon: 'nutrition',
      title: 'Healthy Lifestyle',
      description: 'Maintain a healthy diet and lifestyle to support your fertility journey.',
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Fertility Tips</ThemedText>
      {tips.map((tip, index) => (
        <ThemedView key={index} style={styles.tipCard}>
          <ThemedView style={styles.tipHeader}>
            <Ionicons name={tip.icon as any} size={24} color="#4ECDC4" />
            <ThemedText style={styles.tipTitle}>{tip.title}</ThemedText>
          </ThemedView>
          <ThemedText style={styles.tipDescription}>{tip.description}</ThemedText>
        </ThemedView>
      ))}
    </ThemedView>
  );
};