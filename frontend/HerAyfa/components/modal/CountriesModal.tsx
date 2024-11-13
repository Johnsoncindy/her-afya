import React, { useState, useMemo } from 'react';
import {
  Modal,
  StyleSheet,
  Pressable,
  TextInput,
  FlatList,
  View,
  Platform,
} from 'react-native';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { countries } from '@/constants/Countries';

interface CountrySelectorProps {
  selectedCountry: string;
  onSelect: (countryCode: string) => void;
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({
  selectedCountry,
  onSelect,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const selectedCountryName = countries[selectedCountry as keyof typeof countries]?.name;

  const filteredCountries = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return Object.entries(countries)
      .filter(([code, country]) =>
        country.name.toLowerCase().includes(query) ||
        code.toLowerCase().includes(query)
      )
      .sort((a, b) => a[1].name.localeCompare(b[1].name));
  }, [searchQuery]);

  const renderCountryItem = ({ item }: { item: [string, { name: string, flag: string }] }) => {
    const [code, country] = item;
    const isSelected = code === selectedCountry;

    return (
      <Pressable
        onPress={() => {
          onSelect(code);
          setModalVisible(false);
          setSearchQuery('');
        }}
        style={[
          styles.countryItem,
          isSelected && { backgroundColor: colors.tint + '20' },
        ]}
      >
        <View style={styles.countryItemContent}>
          <ThemedText style={styles.countryFlag}>{country.flag}</ThemedText>
          <ThemedText style={styles.countryName}>{country.name}</ThemedText>
        </View>
        {isSelected && (
          <TabBarIcon name="checkbox" color={colors.tint} size={20} />
        )}
      </Pressable>
    );
  };

  return (
    <>
      <Pressable
        onPress={() => setModalVisible(true)}
        style={[
          styles.selectorButton,
          { borderColor: colors.tabIconDefault },
        ]}
      >
        <ThemedText style={styles.selectedCountryText}>
          {countries[selectedCountry as keyof typeof countries]?.flag} {selectedCountryName}
        </ThemedText>
        <TabBarIcon name="chevron-down" color={colors.text} size={20} />
      </Pressable>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <ThemedView style={styles.modalContainer}>
          <ThemedView style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <ThemedView style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Select Country</ThemedText>
              <Pressable
                onPress={() => {
                  setModalVisible(false);
                  setSearchQuery('');
                }}
                style={styles.closeButton}
              >
                <TabBarIcon name="close" color={colors.text} size={24} />
              </Pressable>
            </ThemedView>

            <ThemedView style={[styles.searchContainer, { backgroundColor: colors.background }]}>
              <TabBarIcon name="search" color={colors.tabIconDefault} size={20} />
              <TextInput
                style={[styles.searchInput, { color: colors.text }]}
                placeholder="Search countries..."
                placeholderTextColor={colors.tabIconDefault}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery !== '' && (
                <Pressable onPress={() => setSearchQuery('')}>
                  <TabBarIcon name="close-circle" color={colors.tabIconDefault} size={20} />
                </Pressable>
              )}
            </ThemedView>

            <FlatList
              data={filteredCountries}
              renderItem={renderCountryItem}
              keyExtractor={([code]) => code}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.countriesList}
            />
          </ThemedView>
        </ThemedView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  selectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
  selectedCountryText: {
    fontSize: 16,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    ...Platform.select({
      ios: {
        height: '80%',
      },
      android: {
        maxHeight: '80%',
      },
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
    fontSize: 16,
    paddingVertical: 4,
  },
  countriesList: {
    paddingHorizontal: 16,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  countryItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryFlag: {
    fontSize: 24,
    marginRight: 12,
  },
  countryName: {
    fontSize: 16,
  },
});
