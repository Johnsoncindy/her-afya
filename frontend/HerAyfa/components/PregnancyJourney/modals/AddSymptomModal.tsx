import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useState } from "react";
import { Modal, Pressable, TextInput, StyleSheet, useColorScheme, Platform } from "react-native";
import { PregnancySymptom, PregnancySymptomType } from "../types";
import { Colors } from "@/constants/Colors";

interface AddSymptomModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (symptom: PregnancySymptom) => void;
}

export const AddSymptomModal = ({ visible, onClose, onSubmit }: AddSymptomModalProps) => {
  const [type, setType] = useState<PregnancySymptomType>(PregnancySymptomType.Nausea);
  const [severity, setSeverity] = useState<1 | 2 | 3>(1);
  const [notes, setNotes] = useState('');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleSubmit = () => {
    onSubmit({
      id: Date.now().toString(),
      date: new Date(),
      type,
      severity,
      notes,
    });
    setType(PregnancySymptomType.Nausea);
    setSeverity(1);
    setNotes('');
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
    symptomButton: {
      backgroundColor: isDark ? '#2C2C2E' : '#E5E7EB',
    },
    severityButton: {
      backgroundColor: isDark ? '#2C2C2E' : '#E5E7EB',
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <ThemedView style={styles.modalContainer}>
        <ThemedView style={[styles.modalContent, dynamicStyles.modalContent]}>
          <ThemedText style={[styles.modalTitle, dynamicStyles.text]}>
            Add Symptom
          </ThemedText>

          {/* Symptom Type Selection */}
          <ThemedView style={styles.symptomContainer}>
            {Object.entries(PregnancySymptomType).map(([key, value]) => (
              <Pressable
                key={key}
                style={[
                  styles.symptomButton,
                  dynamicStyles.symptomButton,
                  type === value && {
                    backgroundColor: isDark ? Colors.dark.tint : Colors.light.tint,
                  },
                ]}
                onPress={() => setType(value)}
              >
                <ThemedText
                  style={[
                    styles.symptomText,
                    dynamicStyles.text,
                    type === value && styles.selectedText,
                  ]}
                >
                  {value}
                </ThemedText>
              </Pressable>
            ))}
          </ThemedView>

          <ThemedText style={[styles.sectionTitle, dynamicStyles.text]}>
            Severity
          </ThemedText>
          
          <ThemedView style={styles.severityContainer}>
            {[
              { value: 1, label: 'Mild' },
              { value: 2, label: 'Moderate' },
              { value: 3, label: 'Severe' }
            ].map(({ value, label }) => (
              <Pressable
                key={value}
                style={[
                  styles.severityButton,
                  dynamicStyles.severityButton,
                  severity === value && {
                    backgroundColor: isDark ? Colors.dark.tint : Colors.light.tint,
                  },
                ]}
                onPress={() => setSeverity(value as 1 | 2 | 3)}
              >
                <ThemedText
                  style={[
                    styles.severityText,
                    dynamicStyles.text,
                    severity === value && styles.selectedText,
                  ]}
                >
                  {label}
                </ThemedText>
              </Pressable>
            ))}
          </ThemedView>

          <TextInput
            style={[styles.input, dynamicStyles.input]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Notes (optional)"
            placeholderTextColor={isDark ? '#666' : '#9CA3AF'}
            multiline
            selectionColor={isDark ? Colors.dark.tint : Colors.light.tint}
          />

          <ThemedView style={styles.buttonContainer}>
            <Pressable
              style={[styles.actionButton, styles.cancelButton]}
              onPress={onClose}
            >
              <ThemedText style={styles.buttonText}>Cancel</ThemedText>
            </Pressable>
            <Pressable
              style={[
                styles.actionButton,
                { backgroundColor: isDark ? Colors.dark.tint : Colors.light.tint },
              ]}
              onPress={handleSubmit}
            >
              <ThemedText style={styles.buttonText}>Add</ThemedText>
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 20,
  },
  symptomContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  symptomButton: {
    flex: 1,
    minWidth: '45%',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  symptomText: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  severityContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  severityButton: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  severityText: {
    fontSize: 14,
    fontWeight: '500',
  },
  selectedText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  input: {
    borderRadius: 12,
    padding: 16,
    minHeight: 120,
    fontSize: 16,
    textAlignVertical: 'top',
    marginBottom: 20,
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
});