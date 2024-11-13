import { differenceInMinutes, format } from "date-fns";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { Pressable, StyleSheet, useColorScheme } from "react-native";
import { useState } from "react";
import { KickCount } from "./types";
import { Colors } from "@/constants/Colors";

interface KickCounterProps {
  kickCounts: KickCount[];
  onAddKickCount: (count: KickCount) => void;
}

export const KickCounter = ({
  kickCounts,
  onAddKickCount,
}: KickCounterProps) => {
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [count, setCount] = useState(0);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleStartTracking = () => {
    setIsTracking(true);
    setStartTime(new Date());
    setCount(0);
  };

  const handleKick = () => {
    setCount((prev) => prev + 1);
  };

  const handleStopTracking = () => {
    if (startTime) {
      onAddKickCount({
        date: new Date(),
        startTime,
        endTime: new Date(),
        count,
      });
    }
    setIsTracking(false);
    setStartTime(null);
  };

  const dynamicStyles = {
    container: {
      backgroundColor: isDark ? Colors.dark.background : Colors.light.background,
    },
    text: {
      color: isDark ? Colors.dark.text : Colors.light.text,
    },
    card: {
      backgroundColor: isDark ? '#2C2C2E' : '#E5E7EB',
    }
  };

  return (
    <ThemedView style={[styles.container, dynamicStyles.container]}>
      <ThemedText style={[styles.title, dynamicStyles.text]}>
        Kick Counter
      </ThemedText>

      <ThemedView style={styles.contentContainer}>
        {isTracking ? (
          <ThemedView style={[styles.trackingCard, dynamicStyles.card]}>
            <ThemedText style={styles.countText}>
              {count}
            </ThemedText>
            <ThemedText style={[styles.timeText, dynamicStyles.text]}>
              Started: {format(startTime!, "h:mm a")}
            </ThemedText>
            
            <ThemedView style={styles.buttonContainer}>
              <Pressable 
                style={[styles.button, styles.kickButton]} 
                onPress={handleKick}
              >
                <ThemedText style={styles.buttonText}>
                  Record Kick
                </ThemedText>
              </Pressable>
              
              <Pressable 
                style={[styles.button, styles.stopButton]} 
                onPress={handleStopTracking}
              >
                <ThemedText style={styles.buttonText}>
                  Stop Tracking
                </ThemedText>
              </Pressable>
            </ThemedView>
          </ThemedView>
        ) : (
          <Pressable 
            style={[styles.button, styles.startButton]} 
            onPress={handleStartTracking}
          >
            <ThemedText style={styles.buttonText}>
              Start Tracking
            </ThemedText>
          </Pressable>
        )}

        <ThemedView style={styles.historyContainer}>
          <ThemedText style={[styles.historyTitle, dynamicStyles.text]}>
            Recent Activity
          </ThemedText>
          {kickCounts.slice(0, 5).map((kick, index) => (
            <ThemedView 
              key={index} 
              style={[styles.historyItem, dynamicStyles.card]}
            >
              <ThemedText style={[styles.historyDate, dynamicStyles.text]}>
                {format(new Date(kick.date), "MMM d, h:mm a")}
              </ThemedText>
              <ThemedText style={[styles.historyCount, dynamicStyles.text]}>
                {kick.count} kicks in {" "}
                {differenceInMinutes(new Date(kick.endTime), new Date(kick.startTime))} min
              </ThemedText>
            </ThemedView>
          ))}
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  contentContainer: {
    flex: 1,
    gap: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  trackingCard: {
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    gap: 16,
  },
  countText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.light.tint,
  },
  timeText: {
    fontSize: 16,
    marginBottom: 8,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  button: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: Colors.light.tint,
  },
  kickButton: {
    backgroundColor: Colors.light.tint,
  },
  stopButton: {
    backgroundColor: '#DC2626',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  historyContainer: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  historyDate: {
    fontSize: 14,
  },
  historyCount: {
    fontSize: 14,
    fontWeight: '500',
  },
});