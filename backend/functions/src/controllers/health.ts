import {Request, Response} from "express";
import db from "../utils/db";

export const getHealthTips = async (req: Request, res: Response) => {
  try {
    const tipsSnapshot = await db.collection("healthTips").get();
    const tips = tipsSnapshot.docs.map((doc) => doc.data());
    res.status(200).json({tips});
  } catch (error) {
    res.status(500).json({error});
  }
};

// Add Health Tip
export const addHealthTip = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const {title, description, image, category} = req.body;

  // Check for missing required fields
  if (!title || !description) {
    return res
      .status(400)
      .json({error: "Title and description are required"});
  }

  try {
    // Save health tip to Firestore
    const healthTipRef = db.collection("healthTips").doc();
    await healthTipRef.set({
      title,
      description,
      image,
      category,
      createdAt: new Date(),
    });

    // Send success response
    return res.status(201).json({message: "Health tip added successfully"});
  } catch (error) {
    // Catch errors and send failure response
    return res.status(500).json({error});
  }
};

// Update Health Tip
export const updateHealthTip = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const {id} = req.params; // Get health tip ID from route params
  const {title, description, image, category} = req.body;

  if (!title || !description) {
    return res.status(400).json({error: "Title and description are required"});
  }

  try {
    const healthTipRef = db.collection("healthTips").doc(id);
    const doc = await healthTipRef.get();

    if (!doc.exists) {
      return res.status(404).json({error: "Health tip not found"});
    }

    await healthTipRef.update({
      title,
      description,
      image,
      category,
      updatedAt: new Date(),
    });

    return res.status(200).json({message: "Health tip updated successfully"});
  } catch (error) {
    return res.status(500).json({error});
  }
};

// Delete Health Tip
export const deleteHealthTip = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const {id} = req.params; // Get health tip ID from route params

  try {
    const healthTipRef = db.collection("healthTips").doc(id);
    const doc = await healthTipRef.get();

    if (!doc.exists) {
      return res.status(404).json({error: "Health tip not found"});
    }

    await healthTipRef.delete();

    return res.status(200).json({message: "Health tip deleted successfully"});
  } catch (error) {
    return res.status(500).json({error});
  }
};
