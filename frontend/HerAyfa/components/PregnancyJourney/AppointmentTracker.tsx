import { format } from "date-fns";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { Pressable, ScrollView, useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Colors } from "@/constants/Colors";
import { ColorScheme } from "../PeriodTracker/types";
import { Appointment } from "./types";
import { styles } from "./styles";
import { AddAppointmentModal } from "./modals/AddAppointmentModal";

interface AppointmentTrackerProps {
  appointments: Appointment[];
  onAddAppointment: (appointment: Appointment) => void;
}


export const AppointmentTracker = ({
  appointments,
  onAddAppointment,
}: AppointmentTrackerProps) => {
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const upcomingAppointments = appointments
    .filter((app) => new Date(app.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
const colorScheme = useColorScheme() as ColorScheme;
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.title}>Upcoming Appointments</ThemedText>
        <Pressable
          style={styles.addButton}
          onPress={() => setShowAppointmentModal(true)}
        >
          <Ionicons name="add" size={24} color={Colors[colorScheme].tint} />
        </Pressable>
      </ThemedView>

      {upcomingAppointments.length > 0 ? (
        <ScrollView>
          {upcomingAppointments.map((appointment, index) => (
            <ThemedView key={index} style={styles.appointmentCard}>
              <ThemedText style={styles.appointmentDate}>
                {format(new Date(appointment.date), "MMM d, yyyy • h:mm a")}
              </ThemedText>
              <ThemedText style={styles.appointmentType}>
                {appointment.type}
              </ThemedText>
              <ThemedText style={styles.appointmentLocation}>
                {appointment.doctor} • {appointment.location}
              </ThemedText>
            </ThemedView>
          ))}
        </ScrollView>
      ) : (
        <ThemedText style={styles.emptyText}>
          No upcoming appointments. Tap + to schedule one.
        </ThemedText>
      )}

      <AddAppointmentModal
        visible={showAppointmentModal}
        onClose={() => setShowAppointmentModal(false)}
        onSubmit={onAddAppointment}
      />
    </ThemedView>
  );
};
