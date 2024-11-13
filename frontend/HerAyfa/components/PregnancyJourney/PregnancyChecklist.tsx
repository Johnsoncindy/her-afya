import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { Pressable, useColorScheme } from "react-native";
import { ChecklistItem } from "./types";
import { styles } from "./styles";
import { format } from "date-fns";
import { Colors } from "@/constants/Colors";
import { ColorScheme } from "../PeriodTracker/types";
import { AddChecklistModal } from "./modals/AddChecklistModal";
import { useState } from "react";

interface PregnancyChecklistProps {
  checklist: ChecklistItem[];
  onUpdateChecklist: (items: ChecklistItem[]) => void;
}

export const PregnancyChecklist = ({
  checklist,
  onUpdateChecklist,
}: PregnancyChecklistProps) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const colorScheme = useColorScheme() as ColorScheme;

  const handleToggleItem = (itemId: string) => {
    const updatedList = checklist.map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    onUpdateChecklist(updatedList);
  };

  const handleAddItem = (item: Omit<ChecklistItem, "id" | "completed">) => {
    const newItem: ChecklistItem = {
      ...item,
      id: Date.now().toString(),
      completed: false,
    };
    onUpdateChecklist([...checklist, newItem]);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.title}>Preparation Checklist</ThemedText>
        <Pressable
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Ionicons name="add" size={24} color={Colors[colorScheme].tint} />
        </Pressable>
      </ThemedView>

      {checklist.map((item, index) => (
        <Pressable
          key={index}
          style={styles.checklistItem}
          onPress={() => handleToggleItem(item.id)}
        >
          <Ionicons
            name={item.completed ? "checkbox" : "square-outline"}
            size={24}
            color={Colors[colorScheme].tint}
          />
          <ThemedView style={styles.itemContent}>
            <ThemedText
              style={[styles.itemText, item.completed && styles.completedText]}
            >
              {item.text}
            </ThemedText>
            {item.dueDate && (
              <ThemedText style={styles.dueDate}>
                Due: {format(new Date(item.dueDate), "MMM d")}
              </ThemedText>
            )}
          </ThemedView>
        </Pressable>
      ))}

      <AddChecklistModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddItem}
      />
    </ThemedView>
  );
};