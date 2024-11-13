import { format } from "date-fns";
import { ThemedText } from "../ThemedText";
import { Image, Pressable, ScrollView, useColorScheme } from "react-native";
import { ThemedView } from "../ThemedView";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useState } from "react";
import { Memory } from "./types";
import { styles } from "./styles";
import { AddMemoryModal } from "./modals/AddMemoryModal";
import { ColorScheme } from "../PeriodTracker/types";

interface MemoriesProps {
  memories: Memory[];
  onAddMemory: (memory: Memory) => void;
}

export const Memories = ({ memories, onAddMemory }: MemoriesProps) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const colorScheme = useColorScheme() as ColorScheme;

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.title}>Memories</ThemedText>
        <Pressable
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Ionicons name="add" size={24} color={Colors[colorScheme].tint} />
        </Pressable>
      </ThemedView>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {memories.map((memory, index) => (
          <ThemedView key={index} style={styles.memoryCard}>
            {memory.type === "photo" && memory.mediaUrl && (
              <Image
                source={{ uri: memory.mediaUrl }}
                style={styles.memoryImage}
              />
            )}
            <ThemedText style={styles.memoryDate}>
              {format(new Date(memory.date), "MMM d, yyyy")}
            </ThemedText>
            <ThemedText style={styles.memoryContent}>
              {memory.content}
            </ThemedText>
          </ThemedView>
        ))}
      </ScrollView>

      <AddMemoryModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={onAddMemory}
      />
    </ThemedView>
  );
};
