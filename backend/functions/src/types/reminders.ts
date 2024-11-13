export interface Reminder {
  id: string;
  userId: string;
  type: "medication" | "appointment";
  title: string;
  description?: string;
  datetime: Date | FirebaseFirestore.Timestamp;
  recurring?: {
    frequency: "daily" | "weekly" | "monthly";
    times?: string[]; // For multiple times per day
    days?: number[]; // For specific days of week/month
  };
  status: "active" | "completed" | "cancelled";
  metadata?: {
    medicationType?: string;
    dosage?: string;
    appointmentType?: string;
    location?: string;
  };
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
}
