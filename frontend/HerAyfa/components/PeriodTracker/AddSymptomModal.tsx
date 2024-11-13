import { Platform, Pressable, ScrollView, useColorScheme } from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { styles } from "./Styles";
import React from "react";
import { Colors } from "@/constants/Colors";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { SYMPTOMS, SymptomType } from "./types";

interface AddSymptomModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectSymptom: (symptom: SymptomType) => void;
  showDatePicker: boolean;
  selectedDate: Date;
  onDateChange: (event: DateTimePickerEvent, date?: Date) => void;
}

export const AddSymptomModal = ({
  visible,
  onClose,
  onSelectSymptom,
  showDatePicker,
  selectedDate,
  onDateChange,
}: AddSymptomModalProps) => {
  const colorScheme = useColorScheme();
  
  if (!visible) return null;

  return (
    <ThemedView
      style={[
        styles.modal,
        { backgroundColor: Colors[colorScheme ?? "light"].background },
      ]}
    >
      <ThemedText
        style={[
          styles.modalTitle,
          { color: Colors[colorScheme ?? "light"].text },
        ]}
      >
        Add Symptom
      </ThemedText>
      {!showDatePicker ? (
        <>
          <ScrollView style={styles.symptomList}>
            {SYMPTOMS.map((symptom) => (
              <Pressable
                key={symptom.id}
                style={[
                  styles.symptomButton,
                  { backgroundColor: "rgba(10, 126, 164, 0.1)" },
                ]}
                onPress={() => onSelectSymptom(symptom)}
              >
                <ThemedText
                  style={[
                    styles.symptomButtonText,
                    { color: Colors[colorScheme ?? "light"].text },
                  ]}
                >
                  {symptom.name}
                </ThemedText>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={Colors[colorScheme ?? "light"].tint}
                />
              </Pressable>
            ))}
          </ScrollView>
          <Pressable
            style={[
              styles.closeButton,
              { backgroundColor: Colors[colorScheme ?? "light"].tint },
            ]}
            onPress={onClose}
          >
            <ThemedText style={[styles.closeButtonText, { color: "#FFFFFF" }]}>
              Cancel
            </ThemedText>
          </Pressable>
        </>
      ) : (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onDateChange}
          maximumDate={new Date()}
        />
      )}
    </ThemedView>
  );
};

