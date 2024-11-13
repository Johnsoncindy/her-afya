import React, { useEffect } from 'react';
import { StyleSheet, Pressable, View, ScrollView, SafeAreaView, Linking, Platform, StatusBar } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useHealthStore } from '@/store/healthstore';
import { CountrySelector } from '@/components/modal/CountriesModal';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function EmergencyContactsScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const {
    fetchEmergencyContacts,
    emergencyContacts,
    selectedCountry,
    setSelectedCountry
  } = useHealthStore();

  useEffect(() => {
    fetchEmergencyContacts();
  }, [fetchEmergencyContacts]);

  const handleCall = React.useCallback((number: string) => {
    Linking.openURL(`tel:${number}`);
  }, []);

  const countryContacts = emergencyContacts.find(c => c.countryCode === selectedCountry)?.contacts || [];

  const ContactOption = React.memo(({ contact }: { contact: any }) => {
    const isUrgent = contact.type.toLowerCase().includes('emergency');
    
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
          <MaterialCommunityIcons 
            name={isUrgent ? 'alert-circle' : 'sword-cross'} 
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
    <SafeAreaView style={{ flex: 1, marginTop: Platform.OS === 'ios' ? 40 : StatusBar.currentHeight }}>
      <Stack.Screen 
        options={{
          headerShown: false,
        }} 
      />
      <ThemedView style={styles.container}>
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

          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <TabBarIcon 
                name="arrow-back" 
                color={Colors[colorScheme ?? 'light'].text} 
                size={30}
              />
              </Pressable>
              <ThemedText style={styles.headerTitle}>
                Emergency Contacts
              </ThemedText>
            
              
            </View>
            <View style={styles.headerContent}>
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
          bounces={true}
        >
          <View style={styles.contactsContainer}>
            {countryContacts.map((contact, index) => (
              <ContactOption key={index} contact={contact} />
            ))}
          </View>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 8,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginLeft: 5
  },
  headerContent: {
    alignItems: 'center',
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10
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
  scrollView: {
    flex: 1,
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
});
