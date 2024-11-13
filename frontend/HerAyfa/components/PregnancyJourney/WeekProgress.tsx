import { differenceInDays, format } from "date-fns";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { getBabySizeComparison } from "./utils/pregnancyCalculations";
import { useColorScheme, StyleSheet, View } from "react-native";
import { Colors } from "@/constants/Colors";
import * as Progress from "react-native-progress";

interface WeekProgressProps {
  currentWeek: number;
  trimester: number;
  weekInTrimester: number;
  dueDate: Date;
}

export const WeekProgress = ({
  currentWeek,
  trimester,
  weekInTrimester,
  dueDate,
}: WeekProgressProps) => {
  const babySize = getBabySizeComparison(currentWeek);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const dynamicStyles = {
    text: {
      color: isDark ? Colors.dark.text : Colors.light.text,
    },
    card: {
      backgroundColor: isDark ? '#2C2C2E' : '#E5E7EB',
    },
    subtext: {
      color: isDark ? '#A0AEC0' : '#6B7280',
    },
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <ThemedText style={[styles.weekText, dynamicStyles.text]}>
          Week {currentWeek}
        </ThemedText>
        <ThemedText style={[styles.trimesterText, dynamicStyles.subtext]}>
          Trimester {trimester} • Week {weekInTrimester}
        </ThemedText>
      </View>

      {/* Progress Bar */}
      <ThemedView style={styles.progressContainer}>
        <Progress.Bar
          progress={currentWeek / 40}
          width={null}
          height={8}
          borderRadius={4}
          color={isDark ? Colors.dark.tint : Colors.light.tint}
          unfilledColor={isDark ? '#3A3A3C' : '#E5E7EB'}
          borderColor="transparent"
        />
        <ThemedText style={[styles.progressText, dynamicStyles.subtext]}>
          {Math.round((currentWeek / 40) * 100)}% Complete
        </ThemedText>
      </ThemedView>

      {/* Info Cards Container */}
      <ThemedView style={styles.infoContainer}>
        {/* Baby Size Card */}
        <ThemedView style={[styles.infoCard, dynamicStyles.card]}>
          <ThemedText style={[styles.cardTitle, dynamicStyles.text]}>
            Baby Size
          </ThemedText>
          <ThemedText style={[styles.primaryText, { color: isDark ? Colors.dark.tint : Colors.light.tint }]}>
            {babySize.fruit}
          </ThemedText>
          <ThemedText style={[styles.detailText, dynamicStyles.subtext]}>
            {babySize.length} • {babySize.weight}
          </ThemedText>
        </ThemedView>

        {/* Due Date Card */}
        <ThemedView style={[styles.infoCard, dynamicStyles.card]}>
          <ThemedText style={[styles.cardTitle, dynamicStyles.text]}>
            Due Date
          </ThemedText>
          <ThemedText style={[styles.primaryText, { color: isDark ? Colors.dark.tint : Colors.light.tint }]}>
            {format(dueDate, "MMM d, yyyy")}
          </ThemedText>
          <ThemedText style={[styles.detailText, dynamicStyles.subtext]}>
            {differenceInDays(dueDate, new Date())} days to go
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 24,
  },
  header: {
    alignItems: 'center',
    gap: 4,
  },
  weekText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  trimesterText: {
    fontSize: 16,
  },
  progressContainer: {
    gap: 8,
  },
  progressText: {
    fontSize: 14,
    textAlign: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  infoCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  detailText: {
    fontSize: 14,
    textAlign: 'center',
  },
});
