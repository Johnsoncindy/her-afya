import { ScrollView } from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { styles } from "./styles";
import { getWeeklyMilestones } from "./types";

interface DevelopmentMilestonesProps {
  currentWeek: number;
}

export const DevelopmentMilestones = ({
  currentWeek,
}: DevelopmentMilestonesProps) => {
  const milestones = getWeeklyMilestones(currentWeek);

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Development Milestones</ThemedText>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {milestones.map((milestone, index) => (
          <ThemedView key={index} style={styles.milestoneCard}>
            <ThemedText style={styles.milestoneTitle}>
              {milestone.title}
            </ThemedText>
            <ThemedText style={styles.milestoneDescription}>
              {milestone.description}
            </ThemedText>
          </ThemedView>
        ))}
      </ScrollView>

      <ThemedText style={styles.disclaimer}>
        Every pregnancy is unique. Consult your healthcare provider for
        personalized advice.
      </ThemedText>
    </ThemedView>
  );
};
