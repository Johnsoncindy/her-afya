import {Request, Response} from "express";
import db from "../utils/db";
import * as admin from "firebase-admin";

if (admin.apps.length === 0) {
  admin.initializeApp();
}
// check or create user in Firestore
export const createUser = async (req: Request, res: Response) => {
  try {
    const {user} = req.body;

    if (!user || !user.uid || !user.email) {
      return res.status(400).json({message: "Invalid user data."});
    }

    const userRef = admin.firestore().collection("users").doc(user.uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      // User does not exist, create a new document
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || null,
        photoURL: user.photoURL || null,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      await userRef.set(userData);
      return res.status(201).json({message: "User created successfully."});
    } else {
      return res.status(200).json({message: "User already exists."});
    }
  } catch (error) {
    console.error("Error creating user in Firestore:", error);
    return res.status(500).json({message: "Failed to create user."});
  }
};

// save expo push token to user account
export const savePushToken = async (req: Request, res: Response) => {
  const {userId} = req.params;
  const {pushToken} = req.body;

  if (!userId || !pushToken) {
    return res
      .status(400)
      .json({message: "User ID and push token are required."});
  }

  try {
    // Save the push token to Firestore
    await db.collection("users").doc(userId).update({
      pushToken,
    });

    return res.status(200).json({message: "Push token saved successfully."});
  } catch (error) {
    console.error("Error saving push token:", error);
    return res.status(500).json({message: "Failed to save push token."});
  }
};
