import { format } from "date-fns";
import { ThemedText } from "../ThemedText";
import { Pressable, ScrollView, useColorScheme, View } from "react-native";
import { ThemedView } from "../ThemedView";
import { useState } from "react";
import { PregnancySymptom } from "./types";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles";
import { Colors } from "@/constants/Colors";
import { ColorScheme } from "../PeriodTracker/types";
import { AddSymptomModal } from "./modals/AddSymptomModal";

interface SymptomTrackerProps {
  symptoms: PregnancySymptom[];
  onAddSymptom: (symptom: PregnancySymptom) => void;
}

export const SymptomTracker = ({
  symptoms,
  onAddSymptom,
}: SymptomTrackerProps) => {
  const [showSymptomModal, setShowSymptomModal] = useState(false);
  const recentSymptoms = symptoms.slice(0, 5); // Show last 5 symptoms
  const colorScheme = useColorScheme() as ColorScheme;

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.title}>Symptoms</ThemedText>
        <Pressable
          style={styles.addButton}
          onPress={() => setShowSymptomModal(true)}
        >
          <Ionicons name="add" size={24} color={Colors[colorScheme].tint} />
        </Pressable>
      </ThemedView>

      {recentSymptoms.length > 0 ? (
        <ScrollView>
          {recentSymptoms.map((symptom, index) => (
            <ThemedView key={index} style={styles.symptomCard}>
              <ThemedText style={styles.symptomType}>{symptom.type}</ThemedText>
              <ThemedView style={styles.severityContainer}>
                {[...Array(3)].map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.severityDot,
                      i < symptom.severity && styles.activeDot,
                    ]}
                  />
                ))}
              </ThemedView>
              <ThemedText style={styles.symptomDate}>
                {format(new Date(symptom.date), "MMM d, yyyy")}
              </ThemedText>
              {symptom.notes && (
                <ThemedText style={styles.notes}>{symptom.notes}</ThemedText>
              )}
            </ThemedView>
          ))}
        </ScrollView>
      ) : (
        <ThemedText style={styles.emptyText}>
          No symptoms logged yet. Tap + to add your first symptom.
        </ThemedText>
      )}

      <AddSymptomModal
        visible={showSymptomModal}
        onClose={() => setShowSymptomModal(false)}
        onSubmit={onAddSymptom}
      />
    </ThemedView>
  );
};
