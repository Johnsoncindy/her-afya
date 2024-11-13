import { useState } from "react";
import { Alert, Modal, Pressable, TextInput, useColorScheme } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { Platform, StyleSheet } from "react-native";
import { ChecklistCategory, ChecklistItem } from "../types";
import { Colors } from "@/constants/Colors";

interface AddChecklistModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (item: Omit<ChecklistItem, "id" | "completed">) => void;
}

export const AddChecklistModal = ({
  visible,
  onClose,
  onSubmit,
}: AddChecklistModalProps) => {
  const [text, setText] = useState("");
  const [category, setCategory] = useState<ChecklistCategory>("health");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleSubmit = () => {
    if (!text.trim()) {
      Alert.alert("Error", "Please enter a task");
      return;
    }

    onSubmit({
      text: text.trim(),
      category,
      dueDate: dueDate || undefined,
    });

    handleClose();
  };

  const handleClose = () => {
    setText("");
    setCategory("health");
    setDueDate(null);
    onClose();
  };

  const categories: { id: ChecklistCategory; label: string }[] = [
    { id: "health", label: "Health" },
    { id: "shopping", label: "Shopping" },
    { id: "preparation", label: "Preparation" },
    { id: "documents", label: "Documents" },
  ];

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
    categoryButton: {
      backgroundColor: isDark ? '#2C2C2E' : '#E5E7EB',
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
            Add Task
          </ThemedText>

          <TextInput
            style={[styles.input, dynamicStyles.input]}
            value={text}
            onChangeText={setText}
            placeholder="Enter task..."
            placeholderTextColor={isDark ? '#666' : '#9CA3AF'}
            multiline
            selectionColor={isDark ? Colors.dark.tint : Colors.light.tint}
          />

          <ThemedText style={[styles.sectionTitle, dynamicStyles.text]}>
            Category
          </ThemedText>
          <ThemedView style={styles.categoriesList}>
            {categories.map((cat) => (
              <Pressable
                key={cat.id}
                style={[
                  styles.categoryButton,
                  dynamicStyles.categoryButton,
                  category === cat.id && {
                    backgroundColor: isDark ? Colors.dark.tint : Colors.light.tint,
                  },
                ]}
                onPress={() => setCategory(cat.id)}
              >
                <ThemedText
                  style={[
                    styles.categoryText,
                    category === cat.id && styles.selectedCategoryText,
                  ]}
                >
                  {cat.label}
                </ThemedText>
              </Pressable>
            ))}
          </ThemedView>

          <ThemedText style={[styles.sectionTitle, dynamicStyles.text, { marginTop: 24 }]}>
            Due Date (Optional)
          </ThemedText>
          <Pressable
            style={[styles.dateButton, dynamicStyles.dateButton]}
            onPress={() => setShowDatePicker(true)}
          >
            <ThemedText style={[styles.dateText, dynamicStyles.text]}>
              {dueDate ? format(dueDate, "MMMM d, yyyy") : "Select due date"}
            </ThemedText>
          </Pressable>

          {showDatePicker && (
            <DateTimePicker
              value={dueDate || new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, selectedDate) => {
                setShowDatePicker(Platform.OS === "ios");
                if (selectedDate) {
                  setDueDate(selectedDate);
                }
              }}
              minimumDate={new Date()}
              textColor={isDark ? '#FFFFFF' : '#000000'}
              themeVariant={isDark ? 'dark' : 'light'}
            />
          )}

          <ThemedView style={styles.buttonContainer}>
            <Pressable
              style={[styles.actionButton, styles.cancelButton]}
              onPress={handleClose}
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
              <ThemedText style={styles.buttonText}>Add Task</ThemedText>
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
  input: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  categoriesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    flex: 1,
    minWidth: '45%',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  selectedCategoryText: {
    fontWeight: '600',
  },
  dateButton: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  dateText: {
    fontSize: 16,
    textAlign: 'center',
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
