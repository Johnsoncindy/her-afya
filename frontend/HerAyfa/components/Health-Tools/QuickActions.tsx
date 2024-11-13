import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Pressable, useColorScheme } from 'react-native';
import { QuickAction } from './types';
import { ThemedView } from '../ThemedView';
import { styles } from './styles';
import { ThemedText } from '../ThemedText';



export const QuickActions = () => {
  const colorScheme = useColorScheme();
  
  const actions: QuickAction[] = [
    { icon: 'water', label: 'Log Period', route: '/period-log' },
    { icon: 'thermometer', label: 'Track BBT', route: '/temperature-log' },
    { icon: 'medical', label: 'Symptoms', route: '/symptom-log' },
    { icon: 'analytics', label: 'Reports', route: '/health-reports' },
  ];

  return (
    <ThemedView style={styles.quickActions}>
      {actions.map((action) => (
        <Pressable 
          key={action.route}
          style={styles.quickAction}
          onPress={() => {/* Navigate to route */}}
        >
          <ThemedView style={styles.quickActionIcon}>
            <Ionicons 
              name={action.icon} // TypeScript now knows this is a valid Ionicons icon
              size={24} 
              color={Colors[colorScheme ?? 'light'].tint} 
            />
          </ThemedView>
          <ThemedText style={styles.quickActionLabel}>{action.label}</ThemedText>
        </Pressable>
      ))}
    </ThemedView>
  );
};
