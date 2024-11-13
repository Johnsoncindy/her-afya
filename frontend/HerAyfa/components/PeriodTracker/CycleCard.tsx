import { format } from "date-fns";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { styles } from "./Styles";
import { CycleData } from "./types";

interface CycleCardProps {
    cycle: CycleData;
  }
  
  export const CycleCard = ({ cycle }: CycleCardProps) => (
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
  