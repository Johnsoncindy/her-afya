import { View } from "react-native";
import { Symptom } from "./types";
import { styles } from "./Styles";
import { ThemedText } from "../ThemedText";
import { format } from "date-fns";

interface SymptomItemProps {
    symptom: Symptom;
  }
  
  export const SymptomItem = ({ symptom }: SymptomItemProps) => (
    <View style={styles.symptomItem}>
      <ThemedText style={styles.symptomName}>{symptom.name}</ThemedText>
      <ThemedText style={styles.symptomDate}>
        {format(symptom.date, "MMM d")}
      </ThemedText>
      <View style={styles.intensityDots}>
        {[...Array(symptom.intensity)].map((_, i) => (
          <View key={i} style={styles.intensityDot} />
        ))}
      </View>
    </View>
  );