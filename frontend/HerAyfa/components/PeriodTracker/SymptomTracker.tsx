import { Pressable } from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { styles } from "./Styles";
import { Symptom } from "./types";
import { SymptomList } from "./SymptomList";

interface SymptomTrackerProps {
    symptoms: Symptom[];
    onAddSymptom: () => void;
  }
  
  export const SymptomTracker = ({ symptoms, onAddSymptom }: SymptomTrackerProps) => (
    <ThemedView style={styles.card}>
      <ThemedText style={styles.cardTitle}>Symptom Tracker</ThemedText>
      <Pressable style={styles.addSymptomButton} onPress={onAddSymptom}>
        <ThemedText style={styles.buttonText}>Add Symptoms</ThemedText>
      </Pressable>
      {symptoms.length > 0 && <SymptomList symptoms={symptoms} />}
    </ThemedView>
  );
  
