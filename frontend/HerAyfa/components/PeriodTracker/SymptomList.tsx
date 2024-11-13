import { View } from "react-native";
import { styles } from "./Styles";
import { Symptom } from "./types";
import { SymptomItem } from "./SymptomItem";

interface SymptomListProps {
    symptoms: Symptom[];
  }
  
  export const SymptomList = ({ symptoms }: SymptomListProps) => (
    <View style={styles.symptomsContainer}>
      {symptoms
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .map((symptom, index) => (
          <SymptomItem key={`${symptom.id}-${index}`} symptom={symptom} />
        ))}
    </View>
  );