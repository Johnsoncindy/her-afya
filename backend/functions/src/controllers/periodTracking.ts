import {Request, Response} from "express";
import db from "../utils/db";
import * as admin from "firebase-admin";

// Types
interface UserPeriodData {
  userId: string;
  cycleHistory: CycleData[];
  lastPeriodStart: Date;
  periodEndDate: Date;
  insights: {
    averageCycleLength: number;
    cycleVariation: number;
  };
}

interface CycleData {
  startDate: Date;
  endDate: Date;
  length: number;
  symptoms: Symptom[];
}

interface Symptom {
  id: string;
  name: string;
  intensity: 1 | 2 | 3;
  date: Date;
}

// Main Functions
export const createOrUpdatePeriodData = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const {userId, lastPeriodStart, periodEndDate, insights} = req.body;

  try {
    if (!userId) {
      return res.status(401).json({error: "Unauthorized"});
    }

    const periodDataRef = db.collection("userPeriodData").doc(userId);
    const timestamp = admin.firestore.Timestamp.now();

    await periodDataRef.set(
      {
        userId,
        lastPeriodStart: new Date(lastPeriodStart),
        periodEndDate: periodEndDate ? new Date(periodEndDate) : null,
        insights,
        updatedAt: timestamp,
      },
      {merge: true}
    );

    return res.status(200).json({
      message: "Period data updated successfully",
    });
  } catch (error) {
    console.error("Error updating period data:", error);
    return res.status(500).json({error: "Failed to update period data"});
  }
};

export const getPeriodData = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const {userId} = req.params;

  try {
    if (!userId) {
      return res.status(401).json({error: "Unauthorized"});
    }

    const periodDataDoc = await db
      .collection("userPeriodData")
      .doc(userId)
      .get();

    if (!periodDataDoc.exists) {
      return res.status(404).json({error: "Period data not found"});
    }

    const data = periodDataDoc.data();
    return res.status(200).json({data});
  } catch (error) {
    console.error("Error fetching period data:", error);
    return res.status(500).json({error: "Failed to fetch period data"});
  }
};

export const addCycle = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const {userId, cycleData} = req.body;

  try {
    if (!userId) {
      return res.status(401).json({error: "Unauthorized"});
    }

    const periodDataRef = db.collection("userPeriodData").doc(userId);
    const timestamp = admin.firestore.Timestamp.now();

    await db.runTransaction(async (transaction) => {
      const periodDoc = await transaction.get(periodDataRef);
      if (!periodDoc.exists) {
        throw new Error("Period data not found");
      }

      const currentData = periodDoc.data() as UserPeriodData | undefined;
      const updatedCycleHistory = [
        ...(currentData?.cycleHistory || []),
        cycleData,
      ];

      transaction.update(periodDataRef, {
        cycleHistory: updatedCycleHistory,
        updatedAt: timestamp,
      });
    });

    return res.status(201).json({
      message: "Cycle added successfully",
    });
  } catch (error) {
    console.error("Error adding cycle:", error);
    return res.status(500).json({error: "Failed to add cycle"});
  }
};

export const addSymptom = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const {userId, symptom, cycleIndex} = req.body;

  try {
    if (!userId) {
      return res.status(401).json({error: "Unauthorized"});
    }

    const periodDataRef = db.collection("userPeriodData").doc(userId);
    const timestamp = admin.firestore.Timestamp.now();

    await db.runTransaction(async (transaction) => {
      const periodDoc = await transaction.get(periodDataRef);
      if (!periodDoc.exists) {
        throw new Error("Period data not found");
      }

      const currentData = periodDoc.data() as UserPeriodData | undefined;
      const cycleHistory = [...(currentData?.cycleHistory || [])];

      if (!cycleHistory[cycleIndex]) {
        throw new Error("Cycle not found");
      }

      cycleHistory[cycleIndex].symptoms.push(symptom);

      transaction.update(periodDataRef, {
        cycleHistory,
        updatedAt: timestamp,
      });
    });

    return res.status(201).json({
      message: "Symptom added successfully",
    });
  } catch (error) {
    console.error("Error adding symptom:", error);
    return res.status(500).json({error: "Failed to add symptom"});
  }
};

export const updateInsights = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const {userId, insights} = req.body;

  try {
    if (!userId) {
      return res.status(401).json({error: "Unauthorized"});
    }

    const periodDataRef = db.collection("userPeriodData").doc(userId);
    const timestamp = admin.firestore.Timestamp.now();

    await periodDataRef.update({
      insights,
      updatedAt: timestamp,
    });

    return res.status(200).json({
      message: "Insights updated successfully",
    });
  } catch (error) {
    console.error("Error updating insights:", error);
    return res.status(500).json({error: "Failed to update insights"});
  }
};
