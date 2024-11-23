import { StyleSheet, ScrollView, Pressable } from 'react-native';
import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';

const ToolCard = ({ 
    icon, 
    title, 
    description, 
    onPress 
  }: { 
    icon: keyof typeof Ionicons.glyphMap;
    title: string; 
    description: string; 
    onPress: () => void;
  }) => {
    const colorScheme = useColorScheme();
    
    return (
      <Pressable onPress={onPress}>
        <ThemedView style={styles.toolCard}>
          <Ionicons name={icon} size={24} color={Colors[colorScheme ?? 'light'].tint} />
          <ThemedView style={styles.toolCardContent}>
            <ThemedText style={styles.toolCardTitle}>{title}</ThemedText>
            <ThemedText style={styles.toolCardDescription}>{description}</ThemedText>
          </ThemedView>
          <Ionicons 
            name="chevron-forward" 
            size={24} 
            color={Colors[colorScheme ?? 'light'].tabIconDefault} 
          />
        </ThemedView>
      </Pressable>
    );
  };

  const SegmentControl = ({ 
    segments, 
    selectedIndex, 
    onChange 
  }: { 
    segments: string[]; 
    selectedIndex: number; 
    onChange: (index: number) => void;
  }) => {
    const colorScheme = useColorScheme();
    
    return (
      <ThemedView style={styles.segmentContainer}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.segmentScrollContainer}
      >
        
          {segments.map((segment, index) => (
            <Pressable
              key={segment}
              onPress={() => onChange(index)}
              style={[
                styles.segmentButton,
                index === selectedIndex && {
                  backgroundColor: Colors[colorScheme ?? 'light'].tint,
                },
              ]}
            >
              <ThemedText
                style={[
                  styles.segmentText,
                  index === selectedIndex && styles.segmentTextSelected,
                ]}
              >
                {segment}
              </ThemedText>
            </Pressable>
          ))}
      </ScrollView>
      </ThemedView>
    );
  };
  

export default function HealthToolsScreen() {
  const [selectedSegment, setSelectedSegment] = useState(0);
  const segments = ["Women's Health", "Reminders"];

  // New Women's Health Content
  const WomensHealthContent = () => (
    <ThemedView style={styles.contentContainer}>
      <ThemedText style={styles.sectionTitle}>Women's Health Tracking</ThemedText>
      <ThemedText style={styles.sectionDescription}>
        Track and monitor your reproductive health and wellness
      </ThemedText>
      <ToolCard
        icon="calendar"
        title="Period Tracker"
        description="Track your menstrual cycle, symptoms, and predictions"
        onPress={() => router.push('/period-tracker')}
      />
      <ToolCard
        icon="heart"
        title="Fertility Tracking"
        description="Monitor fertile windows and ovulation"
        onPress={() => router.push('/fertility-tracking')}
      />
      <ToolCard
        icon="medical"
        title="Pregnancy Journey"
        description="Track pregnancy progress and symptoms"
        onPress={() => router.push('/pregnancy-journey')}
      />
    </ThemedView>
  );

  const RemindersContent = () => (
    <ThemedView style={styles.contentContainer}>
      <ThemedText style={styles.sectionTitle}>Health Reminders</ThemedText>
      <ThemedText style={styles.sectionDescription}>
        Set up reminders for medications and health activities
      </ThemedText>
      <ToolCard
        icon="medical"
        title="Medication Reminders"
        description="Set up your medication schedule"
        onPress={() => router.push('/add-reminder')}
      />
      <ToolCard
        icon="calendar"
        title="Appointment Reminders"
        description="Track your upcoming health appointments"
        onPress={() => router.push("/reminders")}
      />
    </ThemedView>
  );

  const getContent = () => {
    switch (selectedSegment) {
      case 0:
        return <WomensHealthContent />;
      case 1:
        return <RemindersContent />;
      default:
        return <WomensHealthContent />;
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.headerTitle}>Health Tools</ThemedText>
      </ThemedView>

      <SegmentControl
        segments={segments}
        selectedIndex={selectedSegment}
        onChange={setSelectedSegment}
      />

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {getContent()}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  segmentScrollContainer: {
    paddingHorizontal: 8,
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    padding: 4,
    height: 45,
  },
  segmentButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 2,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '500',
  },
  segmentTextSelected: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  contentContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 16,
    opacity: 0.8,
    marginBottom: 20,
  },
  toolCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  toolCardContent: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  toolCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  toolCardDescription: {
    fontSize: 14,
    opacity: 0.8,
  },
});