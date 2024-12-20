import { format } from "date-fns";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { styles } from "./Styles";
import { CycleData } from "./types";

interface CycleCardProps {
  cycle: CycleData;
}

export const CycleCard = ({ cycle }: CycleCardProps) => {
  // Validate dates before rendering
  const isValidDate = (date: Date) => date instanceof Date && !isNaN(date.getTime());
  
  if (!isValidDate(cycle.startDate) || !isValidDate(cycle.endDate)) {
    console.log('Invalid dates in cycle:', cycle);
    return null;
  }

  return (
    <ThemedView style={styles.cycleCard}>
      <ThemedText style={styles.cycleDate}>
        {format(cycle.startDate, "MMM d")} - {format(cycle.endDate, "MMM d")}
      </ThemedText>
      <ThemedText style={styles.cycleLength}>{cycle.length} days</ThemedText>
      {cycle.symptoms.length > 0 && (
        <ThemedText style={styles.cycleSymptoms}>
          {cycle.symptoms.length} symptoms recorded
        </ThemedText>
      )}
    </ThemedView>
  );
};
