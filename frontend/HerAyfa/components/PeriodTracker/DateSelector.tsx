import { Platform, Pressable, useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { format, addMonths } from "date-fns";
import { Colors } from "@/constants/Colors";
import { ThemedView } from "../ThemedView";
import { styles } from "./Styles";
import { ThemedText } from "../ThemedText";
import { ColorScheme } from "./types";

interface DateSelectorProps {
  selectedDate: Date;
  showDatePicker: boolean;
  onDateSelect: (event: DateTimePickerEvent, date?: Date) => void;
  onPress: () => void;
}

export const DateSelector = ({
  selectedDate,
  showDatePicker,
  onDateSelect,
  onPress,
}: DateSelectorProps) => {
  const colorScheme = useColorScheme() as ColorScheme;

  return (
    <ThemedView style={styles.datePickerContainer}>
      <ThemedText style={styles.datePickerLabel}>
        Select Period Start Date:
      </ThemedText>
      <Pressable
        style={[
          styles.datePicker,
          { backgroundColor: Colors[colorScheme ?? "light"].tint },
        ]}
        onPress={onPress}
      >
        <Ionicons
          name="calendar"
          size={20}
          color="#FFFFFF"
          style={styles.datePickerIcon}
        />
        <ThemedText style={styles.datePickerText}>
          {format(selectedDate, "MMMM d, yyyy")}
        </ThemedText>
      </Pressable>

      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={selectedDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onDateSelect}
          maximumDate={new Date()}
          minimumDate={addMonths(new Date(), -3)}
        />
      )}
    </ThemedView>
  );
};

