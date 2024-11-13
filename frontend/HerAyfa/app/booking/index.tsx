import {
  StyleSheet,
  ScrollView,
  View,
  Alert,
  Pressable,
  Image,
  Platform,
  StatusBar,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface TimeSlot {
  id: string;
  time: string;
  date: string;
  available: boolean;
}

interface Booking {
  id: string;
  date: string;
  time: string;
  meetLink?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
}

// Time slot selection component
const TimeSlotPicker = ({
  selectedDate,
  slots,
  onSelectSlot,
}: {
  selectedDate: string;
  slots: TimeSlot[];
  onSelectSlot: (slot: TimeSlot) => void;
}) => {
  const colorScheme = useColorScheme();

  return (
    <View style={styles.timeSlotsContainer}>
      <ThemedText style={styles.sectionTitle}>Available Time Slots</ThemedText>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {slots.map((slot) => (
          <Pressable
            key={slot.id}
            style={[
              styles.timeSlot,
              {
                backgroundColor: slot.available
                  ? Colors[colorScheme ?? "light"].background
                  : Colors[colorScheme ?? "light"].tabIconDefault + "40",
                borderColor: Colors[colorScheme ?? "light"].tint,
              },
            ]}
            onPress={() => slot.available && onSelectSlot(slot)}
            disabled={!slot.available}
          >
            <ThemedText style={styles.timeText}>{slot.time}</ThemedText>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

// Calendar day component
const CalendarDay = ({
  date,
  isSelected,
  onSelect,
}: {
  date: Date;
  isSelected: boolean;
  onSelect: () => void;
}) => {
  const colorScheme = useColorScheme();
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <Pressable
      style={[
        styles.calendarDay,
        {
          backgroundColor: isSelected
            ? Colors[colorScheme ?? "light"].tint
            : Colors[colorScheme ?? "light"].background,
          borderColor: Colors[colorScheme ?? "light"].tint,
        },
      ]}
      onPress={onSelect}
    >
      <ThemedText style={[styles.dayName, isSelected && styles.selectedText]}>
        {dayNames[date.getDay()]}
      </ThemedText>
      <ThemedText style={[styles.dayNumber, isSelected && styles.selectedText]}>
        {date.getDate()}
      </ThemedText>
    </Pressable>
  );
};

// Booking confirmation component
const BookingConfirmation = ({
  booking,
  onClose,
}: {
  booking: Booking;
  onClose: () => void;
}) => {
  const colorScheme = useColorScheme();

  return (
    <ThemedView style={styles.confirmationContainer}>
      <TabBarIcon
        name="checkmark-circle"
        color={Colors[colorScheme ?? "light"].tint}
        size={48}
      />
      <ThemedText style={styles.confirmationTitle}>
        Booking Confirmed!
      </ThemedText>
      <ThemedText style={styles.confirmationText}>
        Your appointment is scheduled for:
      </ThemedText>
      <ThemedText style={styles.confirmationDateTime}>
        {booking.date} at {booking.time}
      </ThemedText>
      {booking.meetLink && (
        <>
          <ThemedText style={styles.confirmationText}>
            Join your consultation via Google Meet:
          </ThemedText>
          <Pressable
            style={[
              styles.meetLink,
              { backgroundColor: Colors[colorScheme ?? "light"].tint },
            ]}
            onPress={() =>
              Alert.alert("Open Meet", "Opening Google Meet link...")
            }
          >
            <TabBarIcon name="videocam" color="#FFFFFF" />
            <ThemedText style={styles.meetLinkText}>Join Meeting</ThemedText>
          </Pressable>
        </>
      )}
      <Pressable
        style={[
          styles.closeButton,
          { backgroundColor: Colors[colorScheme ?? "light"].background },
        ]}
        onPress={onClose}
      >
        <ThemedText style={styles.closeButtonText}>Return to Chat</ThemedText>
      </Pressable>
    </ThemedView>
  );
};

export default function BookingScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [calendarDays, setCalendarDays] = useState<Date[]>([]);

  // Generate next 7 days for calendar
  useEffect(() => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      days.push(date);
    }
    setCalendarDays(days);
  }, []);

  // Generate time slots for selected date
  const generateTimeSlots = (date: string): TimeSlot[] => {
    const slots = [];
    const startHour = 9; // 9 AM
    const endHour = 17; // 5 PM

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute of ["00", "30"]) {
        slots.push({
          id: `${date}-${hour}${minute}`,
          time: `${hour}:${minute}`,
          date: date,
          available: Math.random() > 0.3, // Randomly mark some slots as unavailable
        });
      }
    }
    return slots;
  };

  const handleDateSelect = (date: Date) => {
    const formattedDate = date.toLocaleDateString();
    setSelectedDate(formattedDate);
    setSelectedSlot(null);
  };

  const handleBooking = async () => {
    if (!selectedSlot) return;

    // Simulate booking process
    const newBooking: Booking = {
      id: Date.now().toString(),
      date: selectedSlot.date,
      time: selectedSlot.time,
      meetLink: "https://meet.google.com/xxx-yyyy-zzz",
      status: "pending",
    };

    try {
      // Save booking to storage
      await AsyncStorage.setItem("currentBooking", JSON.stringify(newBooking));
      setBooking(newBooking);
    } catch (error) {
      Alert.alert("Error", "Failed to save booking");
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: "Book Appointment",
          headerLeft: () => (
            <Pressable onPress={() => router.back()}>
              <TabBarIcon
                name="arrow-back"
                color={Colors[colorScheme ?? "light"].text}
              />
            </Pressable>
          ),
        }}
      />

      {booking ? (
        <BookingConfirmation booking={booking} onClose={() => router.back()} />
      ) : (
        <ScrollView>
          <View style={styles.doctorInfo}>
            <Image
              source={require("../../assets/images/doc.webp")}
              alt="Doctor profile"
              style={styles.doctorImage}
            />

            <ThemedText style={styles.doctorName}>
              Dr. Rose-Marie T.T. Crusoe
            </ThemedText>
            <ThemedText style={styles.doctorSpecialty}>
              General Practitioner
            </ThemedText>
            <ThemedText style={styles.doctorDetail}>
              15 years experience
            </ThemedText>
          </View>

          <View style={styles.calendarContainer}>
            <ThemedText style={styles.sectionTitle}>Select Date</ThemedText>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.calendar}
            >
              {calendarDays.map((date) => (
                <CalendarDay
                  key={date.toISOString()}
                  date={date}
                  isSelected={date.toLocaleDateString() === selectedDate}
                  onSelect={() => handleDateSelect(date)}
                />
              ))}
            </ScrollView>
          </View>

          {selectedDate && (
            <TimeSlotPicker
              selectedDate={selectedDate}
              slots={generateTimeSlots(selectedDate)}
              onSelectSlot={setSelectedSlot}
            />
          )}

          {selectedSlot && (
            <View style={styles.bookingSection}>
              <ThemedText style={styles.bookingSummary}>
                Appointment on {selectedSlot.date} at {selectedSlot.time}
              </ThemedText>
              <Pressable
                style={[
                  styles.bookButton,
                  { backgroundColor: Colors[colorScheme ?? "light"].tint },
                ]}
                onPress={handleBooking}
              >
                <ThemedText style={styles.bookButtonText}>
                  Confirm Booking
                </ThemedText>
              </Pressable>
            </View>
          )}
        </ScrollView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 40 : StatusBar.currentHeight
  },
  doctorInfo: {
    alignItems: "center",
    padding: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  doctorName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 18,
    marginBottom: 4,
  },
  doctorDetail: {
    fontSize: 16,
    opacity: 0.8,
  },
  calendarContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  calendar: {
    flexDirection: "row",
  },
  calendarDay: {
    width: 70,
    height: 80,
    marginRight: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  selectedText: {
    color: "#FFFFFF",
  },
  dayName: {
    fontSize: 14,
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 20,
    fontWeight: "bold",
  },
  timeSlotsContainer: {
    padding: 20,
  },
  timeSlot: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  timeText: {
    fontSize: 16,
  },
  bookingSection: {
    padding: 20,
    alignItems: "center",
  },
  bookingSummary: {
    fontSize: 16,
    marginBottom: 16,
  },
  bookButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },
  bookButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  confirmationContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  confirmationTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  confirmationText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 8,
  },
  confirmationDateTime: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 24,
  },
  meetLink: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  meetLinkText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  closeButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 24,
  },
  closeButtonText: {
    fontSize: 16,
  },
  doctorImage: {
    marginBottom: 8,
    borderRadius: 12,
    width: 150,
    height: 150,
  },
});
