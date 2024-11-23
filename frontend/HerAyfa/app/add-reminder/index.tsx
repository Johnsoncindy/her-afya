import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { format } from "date-fns";
import { useState } from "react";
import { TextInput, Platform, useColorScheme, StyleSheet, ScrollView, Pressable, Alert } from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Colors } from "@/constants/Colors";
import { Ionicons } from '@expo/vector-icons';
import useUserStore from "@/store/userStore";
import { addReminder } from "../api/reminder/reminder";
import { router } from "expo-router";

interface BaseReminder {
    title: string;
    date: Date;
    time: string;
    description: string;
    completed: boolean;
}

interface MedicationReminder extends BaseReminder {
    medicationName: string;
    dosage?: string;
    frequency: "daily" | "weekly" | "monthly" | "as_needed";
    endDate?: Date;
}

const frequencies = [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'As Needed', value: 'as_needed' }
];

export default function AddMedicationReminderScreen() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const userId = useUserStore.getState().user?.id ?? '';

    const [medicationName, setMedicationName] = useState('');
    const [dosage, setDosage] = useState('');
    const [frequency, setFrequency] = useState('daily');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const handleDateChange = (event: DateTimePickerEvent, date?: Date) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (date) {
            setSelectedDate(date);
        }
    };

    const handleTimeChange = (event: DateTimePickerEvent, time?: Date) => {
        setShowTimePicker(Platform.OS === 'ios');
        if (time) {
            setSelectedTime(time);
        }
    };

    const handleSubmit = async () => {
        // Combine date and time
        const combinedDateTime = new Date(selectedDate);
        combinedDateTime.setHours(selectedTime.getHours());
        combinedDateTime.setMinutes(selectedTime.getMinutes());

        const reminder: MedicationReminder = {
            title: `Take ${medicationName}`,
            date: combinedDateTime,
            time: format(selectedTime, 'HH:mm'),
            description: `Take ${dosage || ''} ${medicationName}${frequency ? ` (${frequency})` : ''}`,
            medicationName,
            dosage,
            frequency: frequency as 'daily' | 'weekly' | 'monthly' | 'as_needed',
            endDate: combinedDateTime,
            completed: false,
        };

        try {
            await addReminder(userId, reminder);
            router.back();
        } catch (error) {
            console.error("Error adding appointment:", error);
            Alert.alert("Error", "Failed to add appointment");
        }
    };

    const dynamicStyles = {
        container: {
            backgroundColor: isDark ? Colors.dark.background : Colors.light.background,
        },
        text: {
            color: isDark ? Colors.dark.text : Colors.light.text,
        },
        input: {
            backgroundColor: isDark ? '#2C2C2E' : '#E5E7EB',
            color: isDark ? Colors.dark.text : Colors.light.text,
        }
    };

    return (
        <ThemedView style={[styles.container, dynamicStyles.container]}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <TextInput
                    style={[styles.input, dynamicStyles.input]}
                    value={medicationName}
                    onChangeText={setMedicationName}
                    placeholder="Medication Name"
                    placeholderTextColor={isDark ? '#666' : '#9CA3AF'}
                />

                <TextInput
                    style={[styles.input, dynamicStyles.input]}
                    value={dosage}
                    onChangeText={setDosage}
                    placeholder="Dosage (e.g., 1 pill, 5ml)"
                    placeholderTextColor={isDark ? '#666' : '#9CA3AF'}
                />

                <ThemedText style={[styles.sectionTitle, dynamicStyles.text]}>
                    Frequency
                </ThemedText>

                <ThemedView style={styles.frequencyContainer}>
                    {frequencies.map((freq) => (
                        <Pressable
                            key={freq.value}
                            style={[
                                styles.frequencyButton,
                                dynamicStyles.input,
                                frequency === freq.value && styles.selectedButton
                            ]}
                            onPress={() => setFrequency(freq.value)}
                        >
                            <ThemedText style={[
                                styles.frequencyText,
                                dynamicStyles.text,
                                frequency === freq.value && styles.selectedText
                            ]}>
                                {freq.label}
                            </ThemedText>
                        </Pressable>
                    ))}
                </ThemedView>

                <ThemedText style={[styles.sectionTitle, dynamicStyles.text]}>
                    Start Date
                </ThemedText>

                <Pressable
                    style={[styles.timeButton, dynamicStyles.input]}
                    onPress={() => setShowDatePicker(true)}
                >
                    <ThemedText style={[styles.timeText, dynamicStyles.text]}>
                        {format(selectedDate, 'MMM dd, yyyy')}
                    </ThemedText>
                </Pressable>

                {showDatePicker && (
                    <DateTimePicker
                        value={selectedDate}
                        mode="date"
                        onChange={handleDateChange}
                        themeVariant={isDark ? 'dark' : 'light'}
                        minimumDate={new Date()}
                    />
                )}

                <ThemedText style={[styles.sectionTitle, dynamicStyles.text]}>
                    Time
                </ThemedText>

                <Pressable
                    style={[styles.timeButton, dynamicStyles.input]}
                    onPress={() => setShowTimePicker(true)}
                >
                    <ThemedText style={[styles.timeText, dynamicStyles.text]}>
                        {format(selectedTime, 'h:mm a')}
                    </ThemedText>
                </Pressable>

                {showTimePicker && (
                    <DateTimePicker
                        value={selectedTime}
                        mode="time"
                        onChange={handleTimeChange}
                        themeVariant={isDark ? 'dark' : 'light'}
                    />
                )}

                <Pressable
                    style={[styles.submitButton, !medicationName && styles.submitButtonDisabled]}
                    onPress={handleSubmit}
                    disabled={!medicationName}
                >
                    <ThemedText style={styles.submitButtonText}>Create Reminder</ThemedText>
                </Pressable>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        paddingTop: Platform.OS === 'ios' ? 60 : 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: 'rgba(0,0,0,0.1)',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        left: 16,
        bottom: 16,
    },
    backText: {
        fontSize: 17,
        marginLeft: 4,
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '600',
        flex: 1,
        textAlign: 'center',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: '600',
        marginBottom: 12,
        marginTop: 8,
    },
    input: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        fontSize: 16,
    },
    frequencyContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 12,
    },
    frequencyButton: {
        flex: 1,
        minWidth: '45%',
        padding: 12,
        borderRadius: 12,
        marginBottom: 8,
    },
    selectedButton: {
        backgroundColor: Colors.light.tint,
    },
    frequencyText: {
        textAlign: 'center',
        fontSize: 14,
    },
    selectedText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    timeButton: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
    },
    timeText: {
        fontSize: 16,
        textAlign: 'center',
    },
    submitButton: {
        backgroundColor: Colors.light.tint,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 24,
    },
    submitButtonDisabled: {
        opacity: 0.5,
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
