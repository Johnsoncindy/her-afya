import {Request, Response} from "express";
import db from "../utils/db";
import {MedicationReminder} from "../types/pregnancy";

export const createMedicationReminder = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const {userId} = req.params;
    const medication = req.body;
    const reminderId = db.collection("reminders").doc().id;

    const reminder: MedicationReminder = {
      id: reminderId,
      userId,
      category: "medication",
      title: medication.medicationName,
      date: medication.date,
      time: medication.time,
      description: medication.description,
      medicationName: medication.medicationName,
      frequency: medication.frequency,
      dosage: medication.dosage,
      endDate: medication.endDate ? medication.endDate : undefined,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection("reminders").doc(reminderId).set(reminder);
    return res.status(201).json({
      message: "Medication reminder created successfully",
      reminderId,
    });
  } catch (error) {
    console.error("Error creating medication reminder:", error);
    const errorMessage =
    error instanceof Error ? error.message : "An unknown error occurred";
    return res.status(500).json({
      error: errorMessage,
      details: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};

export const getReminders = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const {userId} = req.params;
    const {startDate, endDate} = req.query;

    let query = db
      .collection("reminders")
      .where("userId", "==", userId)
      .where("completed", "==", false)
      .orderBy("date", "asc");

    if (startDate) {
      query = query.where("date", ">=", new Date(startDate as string));
    }
    if (endDate) {
      query = query.where("date", "<=", new Date(endDate as string));
    }

    const remindersSnapshot = await query.get();
    const reminders = remindersSnapshot.docs.map((doc) => ({
      ...doc.data(),
    }));

    return res.status(200).json({reminders});
  } catch (error) {
    console.error("Error fetching reminders:", error);
    const errorMessage =
    error instanceof Error ? error.message : "An unknown error occurred";
    return res.status(500).json({
      error: errorMessage,
      details: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};
