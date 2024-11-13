import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { StyleSheet, useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";

export const CalendarInfo = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const dynamicStyles = {
    card: {
      backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7',
    },
    text: {
      color: isDark ? Colors.dark.text : Colors.light.text,
    },
    subtext: {
      color: isDark ? '#A0AEC0' : '#6B7280',
    },
    eventItem: {
      backgroundColor: isDark ? '#2C2C2E' : '#FFFFFF',
    }
  };

  const events = [
    { emoji: '💧', text: 'Period Days' },
    { emoji: '✨', text: 'Fertile Window' },
    { emoji: '🥚', text: 'Ovulation Day' },
  ];

  return (
    <ThemedView style={[styles.card, dynamicStyles.card]}>
      <ThemedView style={styles.header}>
        <ThemedText style={[styles.title, dynamicStyles.text]}>
          Calendar Events
        </ThemedText>
        <ThemedText style={[styles.description, dynamicStyles.subtext]}>
          Your cycle events will be added to your calendar with:
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.eventList}>
        {events.map((event, index) => (
          <ThemedView 
            key={index} 
            style={[styles.eventItem, dynamicStyles.eventItem]}
          >
            <ThemedView style={styles.emojiContainer}>
              <ThemedText style={styles.eventEmoji}>
                {event.emoji}
              </ThemedText>
            </ThemedView>
            <ThemedText style={[styles.eventText, dynamicStyles.text]}>
              {event.text}
            </ThemedText>
          </ThemedView>
        ))}
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  header: {
    marginBottom: 16,
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
  },
  eventList: {
    gap: 12,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 12,
    // Add subtle shadow for better depth
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  emojiContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventEmoji: {
    fontSize: 20,
  },
  eventText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
