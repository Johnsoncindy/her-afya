import React, { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useHealthStore } from "@/store/healthstore";
import { ReminderCard } from "@/components/card/Reminder";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { router } from "expo-router";

type FilterType = 'all' | 'today' | 'upcoming' | 'completed';
type CategoryType = 'all' | 'medication' | 'appointment';

export default function RemindersScreen() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const colors = Colors[colorScheme ?? "light"];
  
    const dynamicStyles = {
      container: {
        backgroundColor: isDark ? Colors.dark.background : Colors.light.background,
      },
      filterButton: {
        backgroundColor: isDark ? '#2C2C2E' : '#F3F4F6',
      },
      activeFilterButton: {
        backgroundColor: colors.tint,
      },
      filterText: {
        color: isDark ? Colors.dark.text : Colors.light.text,
      },
      activeFilterText: {
        color: 'white',
      },
      emptyStateText: {
        color: isDark ? Colors.dark.text : Colors.light.text,
      },
      emptyStateSubtext: {
        color: isDark ? '#A0AEC0' : '#6B7280',
      },
    };
  
  const { reminders, loading, batchFetchData } = useHealthStore();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');

  const reminderList = useMemo(() => {
    const reminderArray = reminders?.reminders || [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // First apply category filter
    let filtered = reminderArray;
    if (activeCategory !== 'all') {
      filtered = filtered.filter(reminder => reminder.category === activeCategory);
    }
    
    // Then apply status/time filter
    switch (activeFilter) {
      case 'today':
        return filtered.filter(reminder => {
          const reminderDate = new Date(reminder.date);
          reminderDate.setHours(0, 0, 0, 0);
          return reminderDate.getTime() === today.getTime() && !reminder.completed;
        });
      case 'upcoming':
        return filtered.filter(reminder => {
          const reminderDate = new Date(reminder.date);
          reminderDate.setHours(0, 0, 0, 0);
          return reminderDate.getTime() > today.getTime() && !reminder.completed;
        });
      case 'completed':
        return filtered.filter(reminder => reminder.completed);
      default:
        return filtered.filter(reminder => !reminder.completed);
    }
  }, [reminders, activeFilter, activeCategory]);

  const FilterButton = ({ type, label }: { type: FilterType; label: string }) => (
    <Pressable
      onPress={() => setActiveFilter(type)}
      style={[
        styles.filterButton,
        dynamicStyles.filterButton,
        activeFilter === type && dynamicStyles.activeFilterButton
      ]}
    >
      <ThemedText
        style={[
          styles.filterButtonText,
          dynamicStyles.filterText,
          activeFilter === type && dynamicStyles.activeFilterText
        ]}
      >
        {label}
      </ThemedText>
    </Pressable>
  );

  const CategoryButton = ({ type, label, icon }: { type: CategoryType; label: string; icon: string }) => (
    <Pressable
      onPress={() => setActiveCategory(type)}
      style={[
        styles.categoryButton,
        dynamicStyles.filterButton,
        activeCategory === type && dynamicStyles.activeFilterButton
      ]}
    >
      <Ionicons
        name={icon as any}
        size={20}
        color={activeCategory === type ? 'white' : colors.tint}
      />
      <ThemedText
        style={[
          styles.categoryButtonText,
          dynamicStyles.filterText,
          activeCategory === type && dynamicStyles.activeFilterText
        ]}
      >
        {label}
      </ThemedText>
    </Pressable>
  );



  const renderHeader = useCallback(() => (
    <View style={styles.header}>
      <View style={styles.filterContainer}>
        <FilterButton type="all" label="All" />
        <FilterButton type="today" label="Today" />
        <FilterButton type="upcoming" label="Upcoming" />
        <FilterButton type="completed" label="Completed" />
      </View>
      
      <View style={styles.categoryContainer}>
        <CategoryButton type="all" label="All" icon="list" />
        <CategoryButton type="medication" label="Medications" icon="medical" />
        <CategoryButton type="appointment" label="Appointments" icon="calendar" />
      </View>
    </View>
  ), [activeFilter, activeCategory, colors.tint]);

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="calendar-outline" size={48} color={colors.text} />
      <ThemedText style={styles.emptyStateText}>No reminders found</ThemedText>
      <ThemedText style={styles.emptyStateSubtext}>
        {activeFilter === 'completed' 
          ? "You haven't completed any reminders yet"
          : "Try adjusting your filters or add a new reminder"}
      </ThemedText>
    </View>
  );

  return (
    <ThemedView style={[styles.container, dynamicStyles.container]}>
      <Stack.Screen
        options={{
          title: "Reminders",
          headerRight: () => (
            <Pressable
            onPress={() => router.push('/add-reminder')}
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <Ionicons name="add" size={24} color={colors.text} />
            </Pressable>
          ),
        }}
      />
      
      <FlatList
        data={reminderList}
        renderItem={({ item }) => <ReminderCard reminder={item} />}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={() => batchFetchData(true)} />
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    gap: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  categoryContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  listContent: {
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 8,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
  },
});
