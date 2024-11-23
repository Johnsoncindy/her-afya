import {Request, Response} from "express";
import db from "../utils/db";
import * as admin from "firebase-admin";
import {
  PregnancyData,
  PregnancySymptom,
  AppointmentReminder,
  WeightEntry,
  KickCount,
  ChecklistItem,
  Memory,
} from "../types/pregnancy";

export const getPregnancyData = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const {userId} = req.params;
    const pregnancyDoc = await db.collection("pregnancyData").doc(userId).get();

    if (!pregnancyDoc.exists) {
      return res.status(404).json({error: "Pregnancy data not found"});
    }

    return res.status(200).json({data: pregnancyDoc.data()});
  } catch (error) {
    console.error("Error fetching pregnancy data:", error);
    return res.status(500).json({error: "Failed to fetch pregnancy data"});
  }
};

export const createPregnancyData = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const data: Partial<PregnancyData> = req.body;
    const {userId} = data;

    if (!userId) {
      return res.status(400).json({error: "UserId is required"});
    }

    const docRef = db.collection("pregnancyData").doc(userId);
    const timestamp = admin.firestore.Timestamp.now();

    await docRef.set({
      ...data,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    return res.status(201).json({
      message: "Pregnancy data created successfully",
      data: {id: docRef.id},
    });
  } catch (error) {
    console.error("Error creating pregnancy data:", error);
    return res.status(500).json({error: "Failed to create pregnancy data"});
  }
};

export const updatePregnancyData = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const {userId} = req.params;
    const updates = req.body;
    const timestamp = admin.firestore.Timestamp.now();

    await db
      .collection("pregnancyData")
      .doc(userId)
      .update({
        ...updates,
        updatedAt: timestamp,
      });

    return res
      .status(200)
      .json({message: "Pregnancy data updated successfully"});
  } catch (error) {
    console.error("Error updating pregnancy data:", error);
    return res.status(500).json({error: "Failed to update pregnancy data"});
  }
};

export const addSymptom = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const {userId} = req.params;
    const symptom: PregnancySymptom = req.body;
    const timestamp = admin.firestore.Timestamp.now();

    await db
      .collection("pregnancyData")
      .doc(userId)
      .update({
        symptoms: admin.firestore.FieldValue.arrayUnion({
          ...symptom,
          createdAt: timestamp,
        }),
        updatedAt: timestamp,
      });

    return res.status(201).json({message: "Symptom added successfully"});
  } catch (error) {
    console.error("Error adding symptom:", error);
    return res.status(500).json({error: "Failed to add symptom"});
  }
};

export const addAppointment = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const {userId} = req.params;
    const appointment = req.body;
    const timestamp = admin.firestore.Timestamp.now();

    // Start a batch write
    const batch = db.batch();

    // Add to pregnancyData collection
    const pregnancyRef = db.collection("pregnancyData").doc(userId);
    batch.update(pregnancyRef, {
      appointments: admin.firestore.FieldValue.arrayUnion({
        ...appointment,
        createdAt: timestamp,
      }),
      updatedAt: timestamp,
    });

    // Create reminder document
    const reminderRef = db.collection("reminders").doc();
    const reminder: AppointmentReminder = {
      userId,
      id: appointment.id,
      type: appointment.type,
      title: appointment.title || "Doctor's Appointment",
      date: appointment.date,
      time: appointment.time,
      notes: appointment.notes,
      category: "appointment",
      description: `
      Appointment with ${appointment.doctor || "doctor"}
      ${appointment.notes ? `: ${appointment.notes}` : ""}`,
      doctor: appointment.doctor,
      location: appointment.location,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    batch.set(reminderRef, reminder);

    await batch.commit();
    return res.status(201).json({
      message: "Appointment and reminder added successfully",
    });
  } catch (error) {
    console.error("Error adding appointment:", error);
    const errorMessage =
    error instanceof Error ? error.message : "An unknown error occurred";
    return res.status(500).json({
      error: errorMessage,
      details: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};

export const addWeight = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const {userId} = req.params;
    const weight: WeightEntry = req.body;
    const timestamp = admin.firestore.Timestamp.now();

    await db
      .collection("pregnancyData")
      .doc(userId)
      .update({
        weightEntries: admin.firestore.FieldValue.arrayUnion({
          ...weight,
          createdAt: timestamp,
        }),
        updatedAt: timestamp,
      });

    return res.status(201).json({message: "Weight entry added successfully"});
  } catch (error) {
    console.error("Error adding weight entry:", error);
    return res.status(500).json({error: "Failed to add weight entry"});
  }
};

export const addKickCount = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const {userId} = req.params;
    const kickCount: KickCount = req.body;
    const timestamp = admin.firestore.Timestamp.now();

    await db
      .collection("pregnancyData")
      .doc(userId)
      .update({
        kickCounts: admin.firestore.FieldValue.arrayUnion({
          ...kickCount,
          createdAt: timestamp,
        }),
        updatedAt: timestamp,
      });

    return res.status(201).json({message: "Kick count added successfully"});
  } catch (error) {
    console.error("Error adding kick count:", error);
    return res.status(500).json({error: "Failed to add kick count"});
  }
};

export const updateChecklist = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const {userId} = req.params;
    const {checklist}: { checklist: ChecklistItem[] } = req.body;
    const timestamp = admin.firestore.Timestamp.now();

    await db.collection("pregnancyData").doc(userId).update({
      checklist,
      updatedAt: timestamp,
    });

    return res.status(200).json({message: "Checklist updated successfully"});
  } catch (error) {
    console.error("Error updating checklist:", error);
    return res.status(500).json({error: "Failed to update checklist"});
  }
};

export const addMemory = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const {userId} = req.params;
    const memory: Memory = req.body;
    const timestamp = admin.firestore.Timestamp.now();

    await db
      .collection("pregnancyData")
      .doc(userId)
      .update({
        memories: admin.firestore.FieldValue.arrayUnion({
          ...memory,
          createdAt: timestamp,
        }),
        updatedAt: timestamp,
      });

    return res.status(201).json({message: "Memory added successfully"});
  } catch (error) {
    console.error("Error adding memory:", error);
    return res.status(500).json({error: "Failed to add memory"});
  }
};
