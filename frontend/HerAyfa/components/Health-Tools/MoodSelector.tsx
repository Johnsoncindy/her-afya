import { Pressable, useColorScheme, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MoodEntry } from './types';
import { styles } from './styles';
import { ThemedText } from '../ThemedText';
import { Colors } from '@/constants/Colors';

type MoodSelectorProps = {
  selectedMood?: MoodEntry['mood'];
  onSelectMood: (mood: MoodEntry['mood']) => void;
};

export const MoodSelector: React.FC<MoodSelectorProps> = ({
  selectedMood,
  onSelectMood,
}) => {
  const moods: { mood: MoodEntry['mood']; icon: keyof typeof Ionicons.glyphMap }[] = [
    { mood: 'happy', icon: 'happy' },
    { mood: 'sad', icon: 'sad' },
    { mood: 'anxious', icon: 'warning' },
    { mood: 'energetic', icon: 'sunny' },
    { mood: 'tired', icon: 'bed' },
    { mood: 'neutral', icon: 'remove' },
  ];
    
  const colorScheme = useColorScheme();

  return (
    <View style={styles.moodContainer}>
      {moods.map(({ mood, icon }) => (
        <Pressable
          key={mood}
          onPress={() => onSelectMood(mood)}
          style={[
            styles.moodButton,
            selectedMood === mood && styles.selectedMoodButton
          ]}
        >
          <Ionicons 
            name={icon} 
            size={24} 
            color={selectedMood === mood ? '#fff' : Colors[colorScheme ?? 'light'].text} 
          />
          <ThemedText style={[
            styles.moodText,
            selectedMood === mood && styles.selectedMoodText
          ]}>
            {mood}
          </ThemedText>
        </Pressable>
      ))}
    </View>
  );
};