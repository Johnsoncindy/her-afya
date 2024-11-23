import { View } from "react-native";
import { format } from "date-fns";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Reminder } from "@/store/types/health";

interface ReminderProps {
  reminder: Reminder;
}

export const ReminderCard = ({ reminder }: ReminderProps) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = Colors[colorScheme ?? "light"];

  const dynamicStyles = {
    card: {
      backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
    },
    text: {
      color: isDark ? Colors.dark.text : Colors.light.text,
    },
    subtext: {
      color: isDark ? '#A0AEC0' : '#6B7280',
    },
    icon: {
      backgroundColor: isDark ? '#2C2C2E' : '#F3F4F6',
    }
  };

  const formatDateTime = (date: string, time: string) => {
    const reminderDate = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let prefix = format(reminderDate, 'MMM d');
    if (format(reminderDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) {
      prefix = 'Today';
    } else if (format(reminderDate, 'yyyy-MM-dd') === format(tomorrow, 'yyyy-MM-dd')) {
      prefix = 'Tomorrow';
    }

    const [hours, minutes] = time.split(':');
    const timeStr = new Date(0, 0, 0, parseInt(hours), parseInt(minutes))
      .toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

    return `${prefix}, ${timeStr}`;
  };

  const getIcon = (reminder: Reminder) => {
    if (reminder.category === 'medication') {
      return 'medical';
    }
    if (reminder.category === 'appointment') {
      return reminder.type === 'blood_test' ? 'water' : 'calendar';
    }
    return 'calendar';
  };

  const getTitle = (reminder: Reminder) => {
    if (reminder.category === 'medication') {
      return `Take ${reminder.dosage} ${reminder.medicationName}`;
    }
    return reminder.title;
  };

  return (
    <ThemedView style={[styles.card, dynamicStyles.card]}>
      <View style={[styles.iconContainer, dynamicStyles.icon]}>
        <Ionicons
          name={getIcon(reminder)}
          size={20}
          color={colors.tint}
        />
      </View>
      <View style={styles.content}>
        <ThemedText style={[styles.title, dynamicStyles.text]}>
          {getTitle(reminder)}
        </ThemedText>
        <ThemedText style={[styles.time, dynamicStyles.subtext]}>
          {formatDateTime(reminder.date, reminder.time)}
        </ThemedText>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
    gap: 4
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  time: {
    fontSize: 14,
  },

});
