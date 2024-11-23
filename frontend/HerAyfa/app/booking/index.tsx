import {
  StyleSheet,
  ScrollView,
  View,
  Alert,
  Pressable,
  Image,
  Platform,
  StatusBar,
  Dimensions,
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
  paymentStatus?: "pending" | "completed";
  amount: number;
}

// Step indicator component
const StepIndicator = ({ currentStep }: { currentStep: number }) => {
  const steps = ["Select Date & Time", "Review", "Payment"];
  const colorScheme = useColorScheme();

  return (
    <View style={styles.stepContainer}>
      {steps.map((step, index) => (
        <View key={step} style={styles.stepWrapper}>
          <View
            style={[
              styles.stepCircle,
              {
                backgroundColor:
                  index <= currentStep
                    ? Colors[colorScheme ?? "light"].tint
                    : Colors[colorScheme ?? "light"].tabIconDefault + "40",
              },
            ]}
          >
            <ThemedText
              style={[styles.stepNumber, index <= currentStep && styles.activeStepText]}
            >
              {index + 1}
            </ThemedText>
          </View>
          <ThemedText style={styles.stepText}>{step}</ThemedText>
        </View>
      ))}
    </View>
  );
};

// Calendar component with grid layout
const Calendar = ({
  selectedDate,
  onSelectDate,
}: {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
}) => {
  const [dates, setDates] = useState<Date[]>([]);
  const colorScheme = useColorScheme();

  useEffect(() => {
    const generateDates = () => {
      const today = new Date();
      const datesArray: Date[] = [];
      for (let i = 0; i < 31; i++) {
        const date = new Date();
        date.setDate(today.getDate() + i);
        datesArray.push(date);
      }
      setDates(datesArray);
    };
    generateDates();
  }, []);

  return (
    <View style={styles.calendarGrid}>
      {dates.map((date) => (
        <Pressable
          key={date.toISOString()}
          style={[
            styles.calendarCell,
            {
              backgroundColor:
                selectedDate?.toDateString() === date.toDateString()
                  ? Colors[colorScheme ?? "light"].tint
                  : Colors[colorScheme ?? "light"].background,
              borderColor: Colors[colorScheme ?? "light"].tint,
            },
          ]}
          onPress={() => onSelectDate(date)}
        >
          <ThemedText
            style={[
              styles.calendarDayName,
              selectedDate?.toDateString() === date.toDateString() &&
                styles.selectedText,
            ]}
          >
            {date.toLocaleDateString(undefined, { weekday: 'short' })}
          </ThemedText>
          <ThemedText
            style={[
              styles.calendarDate,
              selectedDate?.toDateString() === date.toDateString() &&
                styles.selectedText,
            ]}
          >
            {date.getDate()}
          </ThemedText>
        </Pressable>
      ))}
    </View>
  );
};

// Payment summary component
const PaymentSummary = ({
  booking,
  onConfirmPayment,
}: {
  booking: Booking;
  onConfirmPayment: () => void;
}) => {
  const colorScheme = useColorScheme();

  return (
    <View style={styles.paymentContainer}>
      <ThemedText style={styles.paymentTitle}>Payment Summary</ThemedText>
      <View style={styles.paymentDetails}>
        <View style={styles.paymentRow}>
          <ThemedText>Consultation Fee</ThemedText>
          <ThemedText>${booking.amount}</ThemedText>
        </View>
        <View style={styles.paymentRow}>
          <ThemedText>Platform Fee</ThemedText>
          <ThemedText>$2.00</ThemedText>
        </View>
        <View style={[styles.paymentRow, styles.totalRow]}>
          <ThemedText style={styles.totalText}>Total</ThemedText>
          <ThemedText style={styles.totalText}>
            ${(booking.amount + 2).toFixed(2)}
          </ThemedText>
        </View>
      </View>
      <Pressable
        style={[
          styles.paymentButton,
          { backgroundColor: Colors[colorScheme ?? "light"].tint },
        ]}
        onPress={onConfirmPayment}
      >
        <TabBarIcon name="card" color="#FFFFFF" size={24} />
        <ThemedText style={styles.paymentButtonText}>Pay Now</ThemedText>
      </Pressable>
    </View>
  );
};

export default function BookingScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);

  const generateTimeSlots = (date: Date): TimeSlot[] => {
    const slots = [];
    const startHour = 9;
    const endHour = 17;

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute of ["00", "30"]) {
        slots.push({
          id: `${date.toDateString()}-${hour}${minute}`,
          time: `${hour}:${minute}`,
          date: date.toLocaleDateString(),
          available: Math.random() > 0.3,
        });
      }
    }
    return slots;
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleConfirmSlot = () => {
    if (!selectedSlot) return;
    
    const newBooking: Booking = {
      id: Date.now().toString(),
      date: selectedSlot.date,
      time: selectedSlot.time,
      status: "pending",
      paymentStatus: "pending",
      amount: 10.00, // Base consultation fee
    };
    
    setBooking(newBooking);
    setCurrentStep(1);
  };

  const handleConfirmBooking = () => {
    setCurrentStep(2);
  };

  const handlePayment = async () => {
    if (!booking) return;

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const paidBooking: Booking = {
        ...booking,
        status: "confirmed" as const,
        paymentStatus: "completed" as const,
        meetLink: "https://meet.google.com/xxx-yyyy-zzz"
      };
      
      await AsyncStorage.setItem("currentBooking", JSON.stringify(paidBooking));
      setBooking(paidBooking);
      Alert.alert(
        "Payment Successful",
        "Your appointment has been confirmed. You will receive an email with the meeting details.",
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert("Error", "Payment failed. Please try again.");
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

      <StepIndicator currentStep={currentStep} />

      <ScrollView>
        {currentStep === 0 && (
          <>
            <View style={styles.doctorInfo}>
              <Image
                source={require("../../assets/images/doc.webp")}
                style={styles.doctorImage}
              />
              <View style={styles.doctorTextInfo}>
                <ThemedText style={styles.doctorName}>
                  Dr. Rose-Marie T.T. Crusoe
                </ThemedText>
                <ThemedText style={styles.doctorSpecialty}>
                  General Practitioner
                </ThemedText>
                <ThemedText style={styles.doctorDetail}>
                  15 years experience • $10/consultation
                </ThemedText>
              </View>
            </View>

            <View style={styles.bookingContainer}>
              <View style={styles.calendarContainer}>
                <ThemedText style={styles.sectionTitle}>Select Date</ThemedText>
                <Calendar
                  selectedDate={selectedDate}
                  onSelectDate={handleDateSelect}
                />
              </View>

              {selectedDate && (
                <View style={styles.timeSlotsContainer}>
                  <ThemedText style={styles.sectionTitle}>
                    Available Times
                  </ThemedText>
                  <ScrollView showsVerticalScrollIndicator={false}>
                    {generateTimeSlots(selectedDate).map((slot) => (
                      <Pressable
                        key={slot.id}
                        style={[
                          styles.timeSlotItem,
                          {
                            backgroundColor: slot.available
                              ? selectedSlot?.id === slot.id
                                ? Colors[colorScheme ?? "light"].tint
                                : Colors[colorScheme ?? "light"].background
                              : Colors[colorScheme ?? "light"].tabIconDefault +
                                "40",
                            borderColor: Colors[colorScheme ?? "light"].tint,
                          },
                        ]}
                        onPress={() => slot.available && setSelectedSlot(slot)}
                        disabled={!slot.available}
                      >
                        <ThemedText
                          style={[
                            styles.timeText,
                            selectedSlot?.id === slot.id && styles.selectedText,
                          ]}
                        >
                          {slot.time}
                        </ThemedText>
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>
              )}

              {selectedSlot && (
                <Pressable
                  style={[
                    styles.nextButton,
                    { backgroundColor: Colors[colorScheme ?? "light"].tint },
                  ]}
                  onPress={handleConfirmSlot}
                >
                  <ThemedText style={styles.nextButtonText}>
                    Confirm Time Slot
                  </ThemedText>
                </Pressable>
              )}
            </View>
          </>
        )}

        {currentStep === 1 && booking && (
          <View style={styles.reviewContainer}>
            <ThemedText style={styles.reviewTitle}>Review Booking</ThemedText>
            <View style={styles.reviewDetails}>
              <View style={styles.reviewItem}>
                <TabBarIcon
                  name="calendar"
                  color={Colors[colorScheme ?? "light"].text}
                />
                <ThemedText style={styles.reviewText}>
                  {booking.date} at {booking.time}
                </ThemedText>
              </View>
              <View style={styles.reviewItem}>
                <TabBarIcon
                  name="person"
                  color={Colors[colorScheme ?? "light"].text}
                />
                <ThemedText style={styles.reviewText}>
                  Dr. Rose-Marie T.T. Crusoe
                </ThemedText>
              </View>
              <View style={styles.reviewItem}>
                <TabBarIcon
                  name="cash"
                  color={Colors[colorScheme ?? "light"].text}
                />
                <ThemedText style={styles.reviewText}>
                  $10.00 + $2.00 platform fee
                </ThemedText>
              </View>
            </View>
            <Pressable
              style={[
                styles.nextButton,
                { backgroundColor: Colors[colorScheme ?? "light"].tint },
              ]}
              onPress={handleConfirmBooking}
            >
              <ThemedText style={styles.nextButtonText}>
                Proceed to Payment
              </ThemedText>
            </Pressable>
          </View>
        )}

        {currentStep === 2 && booking && (
          <PaymentSummary booking={booking} onConfirmPayment={handlePayment} />
        )}
      </ScrollView>
    </ThemedView>
  );
}


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: Platform.OS === "ios" ? 40 : StatusBar.currentHeight,
    },
    stepContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      padding: 20,
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
    stepWrapper: {
      alignItems: "center",
      flex: 1,
    },
    stepCircle: {
      width: 30,
      height: 30,
      borderRadius: 15,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 4,
    },
    stepNumber: {
      fontSize: 14,
      fontWeight: "bold",
    },
    activeStepText: {
      color: "#FFFFFF",
    },
    stepText: {
      fontSize: 12,
      textAlign: "center",
    },
    doctorInfo: {
      flexDirection: "row",
      padding: 20,
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
    doctorImage: {
      width: 80,
      height: 80,
      borderRadius: 40,
      marginRight: 16,
    },
    doctorTextInfo: {
      flex: 1,
      justifyContent: "center",
    },
    doctorName: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 4,
    },
    doctorSpecialty: {
      fontSize: 16,
      marginBottom: 4,
    },
    doctorDetail: {
      fontSize: 14,
      opacity: 0.8,
    },
    bookingContainer: {
      padding: 20,
    },
    calendarContainer: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 12,
    },
    calendarGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      marginHorizontal: -5,
    },
    calendarCell: {
      width: (Dimensions.get("window").width - 60) / 4,
      height: 70,
      margin: 5,
      borderRadius: 8,
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    calendarDayName: {
      fontSize: 12,
      marginBottom: 4,
    },
    calendarDate: {
      fontSize: 16,
      fontWeight: "bold",
    },
    selectedText: {
      color: "#FFFFFF",
    },
    timeSlotsContainer: {
      marginBottom: 20,
      maxHeight: 300,
    },
    timeSlotItem: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      borderWidth: 1,
      marginBottom: 8,
    },
    timeText: {
      fontSize: 16,
      textAlign: "center",
    },
    nextButton: {
      paddingVertical: 16,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 20,
    },
    nextButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "bold",
    },
    reviewContainer: {
      padding: 20,
    },
    reviewTitle: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
    },
    reviewDetails: {
      backgroundColor: "rgba(0,0,0,0.05)",
      borderRadius: 12,
      padding: 16,
    },
    reviewItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: "rgba(0,0,0,0.1)",
    },
    reviewText: {
      fontSize: 16,
      marginLeft: 12,
    },
    paymentContainer: {
      padding: 20,
    },
    paymentTitle: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
    },
    paymentDetails: {
      backgroundColor: "rgba(0,0,0,0.05)",
      borderRadius: 12,
      padding: 16,
    },
    paymentRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 12,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: "rgba(0,0,0,0.1)",
    },
    totalRow: {
      borderBottomWidth: 0,
      marginTop: 8,
      paddingBottom: 0,
    },
    totalText: {
      fontSize: 18,
      fontWeight: "bold",
    },
    paymentButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 16,
      borderRadius: 8,
      marginTop: 20,
    },
    paymentButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "bold",
      marginLeft: 8,
    }
  });