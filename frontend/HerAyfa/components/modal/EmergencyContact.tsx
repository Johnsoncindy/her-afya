import React, { useEffect } from 'react';
import { StyleSheet, Modal, Pressable, View, Animated, Linking, ScrollView, SafeAreaView } from 'react-native';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHealthStore } from '@/store/healthstore';
import { CountrySelector } from './CountriesModal';

interface EmergencyContactsModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export const EmergencyContactsModal = ({ 
  isVisible, 
  onClose 
}: EmergencyContactsModalProps) => {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const [scaleAnim] = React.useState(new Animated.Value(0));
  const {
    fetchEmergencyContacts,
    emergencyContacts,
    selectedCountry,
    setSelectedCountry
  } = useHealthStore();

  useEffect(() => {
    fetchEmergencyContacts();
  }, );

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

  const handleCall = React.useCallback((number: string) => {
    Linking.openURL(`tel:${number}`);
  }, []);

  const countryContacts = emergencyContacts.find(c => c.countryCode === selectedCountry)?.contacts || [];

  const ContactOption = React.memo(({ contact }: { contact: any }) => {
    // Determine if the contact is urgent (assuming emergency services are urgent)
    const isUrgent = contact.type.toLowerCase().includes('emergency');
    
    // Convert contact type from SNAKE_CASE to Title Case
    const label = contact.type.split('_').map((word: string) => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');

    return (
      <Pressable
        style={({ pressed }) => [
          styles.contactOption,
          {
            backgroundColor: isUrgent 
              ? Colors[colorScheme ?? 'light'].tint + '15'
              : pressed ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
            borderColor: Colors[colorScheme ?? 'light'].tabIconDefault + '40'
          }
        ]}
        onPress={() => handleCall(contact.number)}
        android_ripple={{ color: 'rgba(0, 0, 0, 0.1)' }}
      >
        <View style={[styles.contactIconContainer, {
          backgroundColor: isUrgent 
            ? Colors[colorScheme ?? 'light'].tint + '20'
            : 'rgba(10, 126, 164, 0.1)'
        }]}>
          <TabBarIcon 
            name={isUrgent ? 'alert-circle' : 'call-outline'} 
            color={Colors[colorScheme ?? 'light'].tint}
            size={24}
          />
        </View>
        <View style={styles.contactTextContainer}>
          <ThemedText style={styles.contactLabel}>
            {label}
          </ThemedText>
          <ThemedText style={[styles.contactNumber, {
            color: Colors[colorScheme ?? 'light'].tint
          }]}>
            {contact.number}
          </ThemedText>
          <ThemedText style={[styles.contactDescription, {
            color: Colors[colorScheme ?? 'light'].tabIconDefault
          }]}>
            {contact.description}
          </ThemedText>
        </View>
        <TabBarIcon 
          name="call-outline" 
          color={Colors[colorScheme ?? 'light'].tint}
          size={20}
        />
      </Pressable>
    );
  });

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <SafeAreaView style={styles.modalOverlay}>
        <Pressable 
          style={[styles.modalOverlay, { paddingTop: insets.top }]} 
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
                borderColor: Colors[colorScheme ?? 'light'].tabIconDefault + '40',
                maxHeight: '100%'
              }]}>
                {/* Fixed Header Section */}
                <View>
                  <View style={[styles.emergencyBanner, {
                    backgroundColor: Colors[colorScheme ?? 'light'].tint + '15'
                  }]}>
                    <TabBarIcon 
                      name="alert-circle" 
                      color={Colors[colorScheme ?? 'light'].tint} 
                      size={24}
                    />
                    <ThemedText style={styles.emergencyBannerText}>
                      For immediate life-threatening emergencies, contact emergency services
                    </ThemedText>
                  </View>

                  <View style={styles.modalHeader}>
                    <TabBarIcon 
                      name="call" 
                      color={Colors[colorScheme ?? 'light'].tint} 
                      size={28}
                    />
                    <ThemedText style={styles.modalTitle}>
                      Emergency Contacts
                    </ThemedText>
                    <CountrySelector
                      selectedCountry={selectedCountry}
                      onSelect={setSelectedCountry}
                    />
                  </View>
                </View>

                {/* Scrollable Content */}
                <ScrollView 
                  style={styles.scrollView}
                  contentContainerStyle={styles.scrollViewContent}
                  showsVerticalScrollIndicator={false}
                  bounces={false}
                >
                  <View style={styles.contactsContainer}>
                    {countryContacts.map((contact, index) => (
                      <ContactOption key={index} contact={contact} />
                    ))}
                  </View>
                </ScrollView>

                {/* Fixed Footer */}
                <Pressable 
                  style={({ pressed }) => [
                    styles.closeButton,
                    {
                      backgroundColor: Colors[colorScheme ?? 'light'].tint,
                      opacity: pressed ? 0.8 : 1
                    }
                  ]}
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
      </SafeAreaView>
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
  emergencyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  emergencyBannerText: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
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
    marginBottom: 16,
  },
  scrollView: {
    width: '100%',
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  contactsContainer: {
    padding: 16,
  },
  contactOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 8,
    borderWidth: 1,
  },
  contactIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactTextContainer: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  contactNumber: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  contactDescription: {
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
