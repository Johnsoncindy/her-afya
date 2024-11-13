import React from 'react';
import { StyleSheet, Modal, Pressable, View, Animated } from 'react-native';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

interface LanguageModalProps {
  isVisible: boolean;
  onClose: () => void;
  currentLanguage: string;
  onSelectLanguage: (code: string) => void;
}

// Enhanced language options with health-related context
const languages = [
  { 
    code: 'EN', 
    label: 'English',
    locale: 'en-US',
    description: 'Medical terminology in English',
    icon: 'heart-outline'
  },
  { 
    code: 'ES', 
    label: 'Español',
    locale: 'es-ES',
    description: 'Terminología médica en español',
    icon: 'pulse-outline'
  },
  { 
    code: 'FR', 
    label: 'Français',
    locale: 'fr-FR',
    description: 'Terminologie médicale en français',
    icon: 'fitness-outline'
  },
];

export const LanguageModal = ({ 
  isVisible, 
  onClose, 
  currentLanguage, 
  onSelectLanguage 
}: LanguageModalProps) => {
  const colorScheme = useColorScheme();
  const [scaleAnim] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    if (isVisible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7
      }).start();
    } else {
      scaleAnim.setValue(0);
    }
  }, [isVisible]);

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable 
        style={styles.modalOverlay} 
        onPress={onClose}
      >
        <Animated.View 
          style={[
            styles.modalContainer,
            {
              transform: [{ scale: scaleAnim }],
            }
          ]}
        >
          <Pressable style={styles.modalContent} onPress={e => e.stopPropagation()}>
            <ThemedView style={[styles.modalCard, {
              backgroundColor: Colors[colorScheme ?? 'light'].background,
              borderColor: Colors[colorScheme ?? 'light'].tabIconDefault + '40'
            }]}>
              {/* Header */}
              <View style={styles.modalHeader}>
                <TabBarIcon 
                  name="language" 
                  color={Colors[colorScheme ?? 'light'].tint} 
                  size={28}
                />
                <ThemedText style={styles.modalTitle}>
                  Select Your Language
                </ThemedText>
                <ThemedText style={styles.modalSubtitle}>
                  Choose your preferred language for medical communication
                </ThemedText>
              </View>

              {/* Language Options */}
              <View style={styles.languageOptions}>
                {languages.map((lang) => (
                  <Pressable
                    key={lang.code}
                    style={[
                      styles.languageOption,
                      {
                        backgroundColor: lang.code === currentLanguage 
                          ? Colors[colorScheme ?? 'light'].tint + '15'
                          : 'transparent',
                        borderColor: Colors[colorScheme ?? 'light'].tabIconDefault + '40'
                      }
                    ]}
                    onPress={() => {
                      onSelectLanguage(lang.code);
                      onClose();
                    }}
                  >
                    <View style={styles.languageIconContainer}>
                      <TabBarIcon 
                        name={lang.icon as any} 
                        color={Colors[colorScheme ?? 'light'].tint}
                        size={24}
                      />
                    </View>
                    <View style={styles.languageTextContainer}>
                      <ThemedText style={styles.languageLabel}>
                        {lang.label}
                      </ThemedText>
                      <ThemedText style={[styles.languageDescription, {
                        color: Colors[colorScheme ?? 'light'].tabIconDefault
                      }]}>
                        {lang.description}
                      </ThemedText>
                    </View>
                    {lang.code === currentLanguage && (
                      <TabBarIcon 
                        name="checkmark-circle" 
                        color={Colors[colorScheme ?? 'light'].tint}
                        size={20}
                      />
                    )}
                  </Pressable>
                ))}
              </View>

              {/* Footer */}
              <Pressable 
                style={[styles.closeButton, {
                  backgroundColor: Colors[colorScheme ?? 'light'].tint
                }]}
                onPress={onClose}
              >
                <ThemedText style={styles.closeButtonText}>
                  Close
                </ThemedText>
              </Pressable>
            </ThemedView>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
  },
  modalContent: {
    margin: 20,
  },
  modalCard: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
  },
  modalHeader: {
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
  },
  languageOptions: {
    padding: 16,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 8,
    borderWidth: 1,
  },
  languageIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(10, 126, 164, 0.1)',
    marginRight: 16,
  },
  languageTextContainer: {
    flex: 1,
  },
  languageLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  languageDescription: {
    fontSize: 13,
  },
  closeButton: {
    padding: 16,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
