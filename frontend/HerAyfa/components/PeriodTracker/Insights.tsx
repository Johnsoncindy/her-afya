import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { styles } from "./Styles";

interface InsightsProps {
  averageCycleLength: number | null;
  cycleVariation: number | null;
  cycleCount: number;
}

export const Insights = ({
  averageCycleLength,
  cycleVariation,
  cycleCount
}: InsightsProps) => (
  <ThemedView style={styles.card}>
    <ThemedText style={styles.cardTitle}>Cycle Insights</ThemedText>
    {averageCycleLength !== null && (
      <ThemedText style={styles.insightText}>
        Your average cycle length is {averageCycleLength} days
      </ThemedText>
    )}
    {cycleVariation !== null && (
      <ThemedText style={styles.insightText}>
        Your cycle varies by ±{cycleVariation} days
      </ThemedText>
    )}
    {cycleCount < 2 && (
      <ThemedText style={styles.insightText}>
        Track at least 2 cycles to see insights
      </ThemedText>
    )}
  </ThemedView>
);
