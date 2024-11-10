import {Request, Response} from "express";
import db from "../utils/db";

// Fetch all emergency contacts
export const getEmergencyContacts = async (req: Request, res: Response) => {
  try {
    // Fetch all country documents from the emergencyContacts collection
    const contactsSnapshot = await db.collection("emergencyContacts").get();

    if (contactsSnapshot.empty) {
      return res.status(404).json({error: "No emergency contacts found"});
    }

    // Map through all documents and extract contact data
    const allContacts = contactsSnapshot.docs.map((doc) => {
      const countryData = doc.data();
      const contacts = [];

      // Manually extract each contact type (if it exists)
      for (const contactType in countryData) {
        if (contactType !== "contacts") {
          contacts.push({
            type: contactType,
            number: countryData[contactType].number,
            description: countryData[contactType].description,
          });
        }
      }

      return {
        countryCode: doc.id,
        contacts,
      };
    });

    // Return all emergency contacts
    return res.status(200).json({contacts: allContacts});
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({error: "Failed to fetch emergency contacts"});
  }
};

// Add new emergency contact for a specific country
export const addEmergencyContact = async (req: Request, res: Response) => {
  const {countryCode, type, number, description} = req.body;

  // Validate required fields
  if (!countryCode || !type || !number || !description) {
    return res.status(400).json({
      error: "countryCode, type, number, and description are required",
    });
  }

  try {
    const countryRef = db.collection("emergencyContacts").doc(countryCode);

    // Check if the contact already exists for this country
    const countrySnapshot = await countryRef.get();
    if (countrySnapshot.exists && countrySnapshot.data()?.[type]) {
      return res.status(400).json({
        error:
        `Emergency contact of type ${type} already exists for ${countryCode}`,
      });
    }

    // Add the new emergency contact as a field in the country document
    await countryRef.set(
      {
        [type]: {
          number,
          description,
        },
      },
      {merge: true}
    );

    return res
      .status(201)
      .json({message: "Emergency contact added successfully"});
  } catch (error) {
    console.error(error);
    return res.status(500).json({error: "Failed to add emergency contact"});
  }
};

// Update existing emergency contact
export const updateEmergencyContact = async (req: Request, res: Response) => {
  const {countryCode, type} = req.params;
  const {number, description} = req.body;

  // Validate required fields
  if (!number || !description) {
    return res.status(400).json({
      error: "number and description are required",
    });
  }

  try {
    const countryRef = db.collection("emergencyContacts").doc(countryCode);

    // Check if the contact exists
    const countrySnapshot = await countryRef.get();
    if (!countrySnapshot.exists || !countrySnapshot.data()?.[type]) {
      return res.status(404).json({
        error:
        `Emergency contact of type ${type} not found for ${countryCode}`,
      });
    }

    // Update the contact
    await countryRef.update({
      [`${type}.number`]: number,
      [`${type}.description`]: description,
    });

    return res
      .status(200)
      .json({message: "Emergency contact updated successfully"});
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({error: "Failed to update emergency contact"});
  }
};
