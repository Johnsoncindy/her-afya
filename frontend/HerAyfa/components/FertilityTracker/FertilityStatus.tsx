import { styles } from "../PeriodTracker/Styles";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

interface FertilityStatusProps {
    lastPeriodStart: Date | null;
    nextOvulation: Date | null;
    fertileWindowStart: Date | null;
    fertileWindowEnd: Date | null;
  }
  
  export const FertilityStatus = ({
    lastPeriodStart,
    nextOvulation,
    fertileWindowStart,
    fertileWindowEnd,
  }: FertilityStatusProps) => {
    const getCurrentStatus = () => {
      const now = new Date();
      
      if (fertileWindowStart && fertileWindowEnd) {
        if (now >= fertileWindowStart && now <= fertileWindowEnd) {
          return {
            status: "Fertile Window",
            description: "High chance of conception",
            color: "#4CAF50"
          };
        }
        
        if (nextOvulation && Math.abs(now.getTime() - nextOvulation.getTime()) < 86400000) {
          return {
            status: "Ovulation Day",
            description: "Peak fertility",
            color: "#2196F3"
          };
        }
      }
  
      return {
        status: "Low Fertility",
        description: "Lower chance of conception",
        color: "#9E9E9E"
      };
    };
  
    const status = getCurrentStatus();
  
    return (
      <ThemedView style={[styles.card, { borderLeftColor: status.color }]}>
        <ThemedText style={styles.statusTitle}>{status.status}</ThemedText>
        <ThemedText style={styles.statusDescription}>{status.description}</ThemedText>
      </ThemedView>
    );
  };