import { Pressable, StyleSheet, useColorScheme } from "react-native";
import { format } from "date-fns";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

interface StatusCardProps {
  lastPeriodStart: Date | null;
  periodEndDate: Date | null;
  nextPeriodDate: Date | null;
  onSetEndDate: () => void;
}

export const StatusCard = ({
  lastPeriodStart,
  periodEndDate,
  nextPeriodDate,
  onSetEndDate,
}: StatusCardProps) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const dynamicStyles = {
    card: {
      backgroundColor: isDark ? "#1C1C1E" : "#F2F2F7",
    },
    text: {
      color: isDark ? Colors.dark.text : Colors.light.text,
    },
    subtext: {
      color: isDark ? "#A0AEC0" : "#6B7280",
    },
    dot: {
      active: {
        backgroundColor: isDark ? Colors.dark.tint : Colors.light.tint,
        shadowColor: isDark ? Colors.dark.tint : Colors.light.tint,
      },
      complete: {
        backgroundColor: isDark ? "#34D399" : "#10B981",
        shadowColor: isDark ? "#34D399" : "#10B981",
      },
    },
    badge: {
      backgroundColor: isDark ? "#2C2C2E" : "#FFFFFF",
      borderColor: isDark ? Colors.dark.tint : Colors.light.tint,
    },
    button: {
      backgroundColor: isDark ? Colors.dark.tint : Colors.light.tint,
    },
  };

  if (!lastPeriodStart) {
    return (
      <ThemedView style={[styles.card, dynamicStyles.card]}>
        <ThemedText style={[styles.title, dynamicStyles.text]}>
          Welcome!
        </ThemedText>
        <ThemedText style={[styles.description, dynamicStyles.subtext]}>
          Set your last period start date to begin tracking your cycle.
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.card, dynamicStyles.card]}>
      <ThemedText style={[styles.title, dynamicStyles.text]}>
        Current Period
      </ThemedText>

      <ThemedView style={styles.content}>
        <ThemedView style={styles.dateContainer}>
          <ThemedView style={styles.dateRow}>
            <ThemedView
              style={[
                styles.statusDot,
                periodEndDate
                  ? [styles.completeDot, dynamicStyles.dot.complete]
                  : [styles.activeDot, dynamicStyles.dot.active],
              ]}
            />
            <ThemedText style={[styles.description, dynamicStyles.text]}>
              Started: {format(lastPeriodStart, "MMMM d, yyyy")}
            </ThemedText>
          </ThemedView>

          {periodEndDate ? (
            <ThemedView style={styles.dateRow}>
              <ThemedView
                style={[
                  styles.statusDot,
                  styles.completeDot,
                  dynamicStyles.dot.complete,
                ]}
              />
              <ThemedText style={[styles.description, dynamicStyles.text]}>
                Ended: {format(periodEndDate, "MMMM d, yyyy")}
              </ThemedText>
            </ThemedView>
          ) : (
            <ThemedView style={styles.activeContainer}>
              <ThemedView style={[styles.badge, dynamicStyles.badge]}>
                <ThemedText
                  style={[
                    styles.badgeText,
                    { color: isDark ? Colors.dark.tint : Colors.light.tint },
                  ]}
                >
                  Ongoing
                </ThemedText>
              </ThemedView>

              <Pressable
                style={[styles.button, dynamicStyles.button]}
                onPress={onSetEndDate}
              >
                <Ionicons
                  name="calendar-outline"
                  size={16}
                  color="#FFFFFF"
                  style={styles.buttonIcon}
                />
                <ThemedText style={styles.buttonText}>
                  Set Period End Date
                </ThemedText>
              </Pressable>
            </ThemedView>
          )}
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  content: {
    gap: 16,
  },
  description: {
    fontSize: 16,
  },
  dateContainer: {
    gap: 12,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 3,
  },
  activeDot: {},
  completeDot: {},
  activeContainer: {
    gap: 16,
    marginTop: 8,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    // Add subtle shadow for light mode
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: "500",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 12,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
