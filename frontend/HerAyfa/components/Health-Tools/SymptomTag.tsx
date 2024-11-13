import { StyleSheet, Pressable, useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';
import { ThemedText } from '@/components/ThemedText';
import { Symptom } from './types';
import { styles } from './styles';

type SymptomTagProps = {
  symptom: Symptom;
  selected: boolean;
  onPress: (symptom: Symptom) => void;
  onLongPress?: (symptom: Symptom) => void;
};

export const SymptomTag: React.FC<SymptomTagProps> = ({
  symptom,
  selected,
  onPress,
  onLongPress,
}) => {
  const colorScheme = useColorScheme();
  
  return (
    <Pressable 
      onPress={() => onPress(symptom)}
      onLongPress={() => onLongPress?.(symptom)}
      style={[
        styles.symptomTag,
        selected && { backgroundColor: Colors[colorScheme ?? 'light'].tint },
        symptom.severity && { borderWidth: symptom.severity }
      ]}
    >
      <ThemedText style={[
        styles.selectedSymptomTagText,
        selected && styles.selectedSymptomTagText
      ]}>
        {symptom.name}
      </ThemedText>
    </Pressable>
  );
};
