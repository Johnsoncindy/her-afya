import { useState } from "react";
import { WeightEntry } from "../types";
import { Modal, Pressable, TextInput, StyleSheet, useColorScheme, Platform } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { Colors } from "@/constants/Colors";

interface AddWeightModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (entry: WeightEntry) => void;
}

export const AddWeightModal = ({ visible, onClose, onSubmit }: AddWeightModalProps) => {
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleSubmit = () => {
    if (weight) {
      onSubmit({
        date,
        weight: parseFloat(weight),
      });
      setWeight('');
      setDate(new Date());
      onClose();
    }
  };

  const dynamicStyles = {
    modalContent: {
      backgroundColor: isDark ? Colors.dark.background : Colors.light.background,
    },
    text: {
      color: isDark ? Colors.dark.text : Colors.light.text,
    },
    input: {
      backgroundColor: isDark ? '#2C2C2E' : '#E5E7EB',
      color: isDark ? Colors.dark.text : Colors.light.text,
    },
    dateButton: {
      backgroundColor: isDark ? '#2C2C2E' : '#E5E7EB',
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <ThemedView style={styles.modalContainer}>
        <ThemedView style={[styles.modalContent, dynamicStyles.modalContent]}>
          <ThemedText style={[styles.modalTitle, dynamicStyles.text]}>
            Add Weight
          </ThemedText>

          <Pressable 
            style={[styles.dateButton, dynamicStyles.dateButton]} 
            onPress={() => setShowDatePicker(true)}
          >
            <ThemedText style={[styles.dateText, dynamicStyles.text]}>
              {format(date, 'MMMM d, yyyy')}
            </ThemedText>
          </Pressable>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              onChange={(_, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setDate(selectedDate);
              }}
              textColor={isDark ? '#FFFFFF' : '#000000'}
              themeVariant={isDark ? 'dark' : 'light'}
            />
          )}

          <TextInput
            style={[styles.input, dynamicStyles.input]}
            value={weight}
            onChangeText={setWeight}
            placeholder="Weight (kg)"
            placeholderTextColor={isDark ? '#666' : '#9CA3AF'}
            keyboardType="decimal-pad"
            selectionColor={isDark ? Colors.dark.tint : Colors.light.tint}
          />

          <ThemedView style={styles.buttonContainer}>
            <Pressable 
              style={[styles.actionButton, styles.cancelButton]} 
              onPress={onClose}
            >
              <ThemedText style={styles.buttonText}>
                Cancel
              </ThemedText>
            </Pressable>
            <Pressable 
              style={[
                styles.actionButton, 
                { backgroundColor: isDark ? Colors.dark.tint : Colors.light.tint },
                !weight && styles.disabledButton
              ]} 
              onPress={handleSubmit}
              disabled={!weight}
            >
              <ThemedText style={styles.buttonText}>
                Add
              </ThemedText>
            </Pressable>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  dateButton: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  dateText: {
    fontSize: 16,
    textAlign: 'center',
  },
  input: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 24,
    height: 50,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 20,
    marginBottom: Platform.OS === 'ios' ? 30 : 20,
  },
  actionButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#3A3A3C',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.5,
  },
});