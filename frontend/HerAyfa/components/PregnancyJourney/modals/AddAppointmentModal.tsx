import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { format } from "date-fns";
import { useState } from "react";
import { Modal, Pressable, TextInput, Platform, useColorScheme } from "react-native";
import { Appointment, AppointmentType } from "../types";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

interface AddAppointmentModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (appointment: Appointment) => void;
}

const appointmentTypes: { label: string; value: AppointmentType }[] = [
  { label: 'Checkup', value: 'checkup' },
  { label: 'Ultrasound', value: 'ultrasound' },
  { label: 'Blood Test', value: 'blood_test' },
  { label: 'Screening', value: 'screening' },
  { label: 'Other', value: 'other' }
];

export const AddAppointmentModal = ({ visible, onClose, onSubmit }: AddAppointmentModalProps) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [date, setDate] = useState(new Date());
  const [type, setType] = useState<AppointmentType>('checkup');
  const [doctor, setDoctor] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  
  // Separate state for date and time pickers
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setSelectedDate(selectedDate);
      // Combine date with existing time
      const newDateTime = new Date(selectedDate);
      newDateTime.setHours(date.getHours(), date.getMinutes());
      setDate(newDateTime);
      
      // On Android, show time picker after date is selected
      if (Platform.OS === 'android') {
        setShowTimePicker(true);
      }
    }
  };

  const handleTimeChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      setSelectedTime(selectedTime);
      // Combine existing date with new time
      const newDateTime = new Date(date);
      newDateTime.setHours(selectedTime.getHours(), selectedTime.getMinutes());
      setDate(newDateTime);
    }
  };

  const handleDateTimePress = () => {
    if (Platform.OS === 'ios') {
      setShowDatePicker(true);
      setShowTimePicker(true);
    } else {
      setShowDatePicker(true);
    }
  };

  const handleSubmit = () => {
    onSubmit({
      id: Date.now().toString(),
      date,
      type,
      doctor,
      location,
      notes,
    });
    onClose();
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
    typeButton: {
      backgroundColor: isDark ? '#2C2C2E' : '#E5E7EB',
    },
    cancelButton: {
      backgroundColor: isDark ? '#3A3A3C' : '#D1D5DB',
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <ThemedView style={styles.modalContainer}>
        <ThemedView style={[styles.modalContent, dynamicStyles.modalContent]}>
          <ThemedText style={[styles.modalTitle, dynamicStyles.text]}>
            Add Appointment
          </ThemedText>

          {/* Date/Time Selector */}
          <Pressable 
            style={[styles.datePickerButton, dynamicStyles.typeButton]} 
            onPress={handleDateTimePress}
          >
            <ThemedText style={[styles.datePickerButtonText, dynamicStyles.text]}>
              {format(date, 'MMM d, yyyy h:mm a')}
            </ThemedText>
          </Pressable>

          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              onChange={handleDateChange}
              textColor={isDark ? '#FFFFFF' : '#000000'}
              themeVariant={isDark ? 'dark' : 'light'}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              value={selectedTime}
              mode="time"
              onChange={handleTimeChange}
              textColor={isDark ? '#FFFFFF' : '#000000'}
              themeVariant={isDark ? 'dark' : 'light'}
            />
          )}

          {/* Rest of the modal content remains the same */}
          <ThemedView style={styles.typeContainer}>
            {appointmentTypes.map((appointmentType) => (
              <Pressable
                key={appointmentType.value}
                style={[
                  styles.typeButton,
                  dynamicStyles.typeButton,
                  type === appointmentType.value && styles.typeButtonSelected
                ]}
                onPress={() => setType(appointmentType.value)}
              >
                <ThemedText
                  style={[
                    styles.typeButtonText,
                    dynamicStyles.text,
                    type === appointmentType.value && styles.typeButtonTextSelected
                  ]}
                >
                  {appointmentType.label}
                </ThemedText>
              </Pressable>
            ))}
          </ThemedView>

          <TextInput
            style={[styles.input, dynamicStyles.input]}
            value={doctor}
            onChangeText={setDoctor}
            placeholder="Doctor's Name"
            placeholderTextColor={isDark ? '#666' : '#9CA3AF'}
            selectionColor={isDark ? Colors.dark.tint : Colors.light.tint}
          />

          <TextInput
            style={[styles.input, dynamicStyles.input]}
            value={location}
            onChangeText={setLocation}
            placeholder="Location"
            placeholderTextColor={isDark ? '#666' : '#9CA3AF'}
            selectionColor={isDark ? Colors.dark.tint : Colors.light.tint}
          />

          <TextInput
            style={[styles.input, styles.notesInput, dynamicStyles.input]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Notes (optional)"
            placeholderTextColor={isDark ? '#666' : '#9CA3AF'}
            multiline
            selectionColor={isDark ? Colors.dark.tint : Colors.light.tint}
          />

          <ThemedView style={styles.buttonContainer}>
            <Pressable 
              style={[styles.cancelButton, dynamicStyles.cancelButton]} 
              onPress={onClose}
            >
              <ThemedText style={[styles.buttonText, dynamicStyles.text]}>
                Cancel
              </ThemedText>
            </Pressable>
            <Pressable 
              style={[
                styles.addButton, 
                { backgroundColor: isDark ? Colors.dark.tint : Colors.light.tint },
                !doctor || !location ? styles.addButtonDisabled : null
              ]}
              onPress={handleSubmit}
              disabled={!doctor || !location}
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
  datePickerButton: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  datePickerButtonText: {
    fontSize: 16,
    textAlign: 'center',
  },
  iosDatePicker: {
    height: 120,
    marginBottom: 20,
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  typeButton: {
    flex: 1,
    minWidth: '45%',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  typeButtonSelected: {
    backgroundColor: Colors.light.tint,
  },
  typeButtonText: {
    textAlign: 'center',
    fontSize: 14,
  },
  typeButtonTextSelected: {
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  input: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    fontSize: 16,
  },
  notesInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 20,
    marginBottom: Platform.OS === 'ios' ? 30 : 20,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
