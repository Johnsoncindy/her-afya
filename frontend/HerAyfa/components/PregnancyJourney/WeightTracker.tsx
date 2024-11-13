import { Dimensions, Pressable, useColorScheme } from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ColorScheme } from "../PeriodTracker/types";
import { format } from "date-fns";
import { LineChart } from "react-native-chart-kit";
import React from "react";
import { WeightEntry } from "./types";
import { styles } from "./styles";
import { Colors } from "@/constants/Colors";
import { AddWeightModal } from "./modals/AddWeightModal";

interface WeightTrackerProps {
  weightEntries: WeightEntry[];
  onAddWeight: (entry: WeightEntry) => void;
}

const { width } = Dimensions.get("window");

export const WeightTracker = ({
  weightEntries,
  onAddWeight,
}: WeightTrackerProps) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const colorScheme = useColorScheme() as ColorScheme;

  // Extract just the weight values for the dataset
  const weights = weightEntries.map((entry) => entry.weight);
  // Extract dates for labels
  const labels = weightEntries.map((entry) =>
    format(new Date(entry.date), "MMM d")
  );

  const latestWeight = weightEntries[weightEntries.length - 1]?.weight || 0;
  const firstWeight = weightEntries[0]?.weight || 0;
  const totalGain = latestWeight - firstWeight;

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.title}>Weight Tracker</ThemedText>
        <Pressable
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Ionicons name="add" size={24} color={Colors[colorScheme].tint} />
        </Pressable>
      </ThemedView>

      {weightEntries.length > 0 ? (
        <>
          <LineChart
            data={{
              labels,
              datasets: [
                {
                  data: weights,
                },
              ],
            }}
            width={width - 40}
            height={220}
            yAxisSuffix=" kg"
            chartConfig={{
              backgroundColor: Colors[colorScheme].background,
              backgroundGradientFrom: Colors[colorScheme].background,
              backgroundGradientTo: Colors[colorScheme].background,
              color: () => Colors[colorScheme].tint,
              labelColor: () => Colors[colorScheme].text,
              propsForLabels: {
                fontSize: 12,
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: Colors[colorScheme].tint,
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
          <ThemedView style={styles.statsContainer}>
            <ThemedView style={styles.statItem}>
              <ThemedText style={styles.statLabel}>Current</ThemedText>
              <ThemedText style={styles.statValue}>
                {latestWeight} kg
              </ThemedText>
            </ThemedView>
            <ThemedView style={styles.statItem}>
              <ThemedText style={styles.statLabel}>Total Gain</ThemedText>
              <ThemedText style={styles.statValue}>{totalGain} kg</ThemedText>
            </ThemedView>
          </ThemedView>
        </>
      ) : (
        <ThemedText style={styles.emptyText}>
          Start tracking your weight gain. Tap + to add your first entry.
        </ThemedText>
      )}

      <AddWeightModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={onAddWeight}
      />
    </ThemedView>
  );
};
