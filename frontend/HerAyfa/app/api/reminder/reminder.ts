import client from "../client";

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

const endpoint = "/reminders";

export const getReminders = async (userId: string) =>
  client.get(`${endpoint}/${userId}`);

export const addReminder = async (
  userId: string,
  reminder: MedicationReminder
) => client.post(`${endpoint}/${userId}/medical`, reminder);

