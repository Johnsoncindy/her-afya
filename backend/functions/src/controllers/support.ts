import { Request, Response } from "express";
import db from "../utils/db";
import * as admin from "firebase-admin";
import { getDistance } from "geolib";


// Types
interface SupportRequest {
  id?: string;
  title: string;
  description: string;
  type: "emotional" | "resources" | "guidance" | "companionship";
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  isEmergency: boolean;
  anonymous: boolean;
  userId: string;
  status: "open" | "in-progress" | "closed";
  createdAt: admin.firestore.Timestamp;
  updatedAt: admin.firestore.Timestamp;
}

interface Message {
  id?: string;
  supportRequestId: string;
  senderId: string;
  receiverId: string;
  content: string;
  read: boolean;
  createdAt: admin.firestore.Timestamp;
}

// Support Request Functions
export const createSupportRequest = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const {
    title,
    description,
    type,
    location,
    isEmergency,
    anonymous,
    userId,
  } = req.body;

  // Validate required fields
  if (!title || !description || !type || !location) {
    return res.status(400).json({
      error: "Title, description, type, and location are required",
    });
  }

  try {
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const requestRef = db.collection("supportRequests").doc();
    const timestamp = admin.firestore.Timestamp.now();

    const supportRequest: SupportRequest = {
      title,
      description,
      type,
      location,
      isEmergency,
      anonymous,
      userId,
      status: "open",
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await requestRef.set(supportRequest);

    // If emergency, notify nearby verified users
    if (isEmergency) {
      await notifyNearbyHelpers(location, requestRef.id);
    }

    return res.status(201).json({
      message: "Support request created successfully",
      requestId: requestRef.id,
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to create support request" });
  }
};

export const getSupportRequests = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Fetch only open support requests and order by creation time
    const snapshot = await db.collection("supportRequests")
      .where("status", "==", "open")
      .orderBy("createdAt", "desc")
      .get();

    // Map through each support request and add extra fields as needed
    const requests = await Promise.all(snapshot.docs.map(async (doc) => {
      const data = doc.data() as SupportRequest;
      
      // Get user info if not anonymous
      let userInfo = null;
      if (!data.anonymous) {
        const userDoc = await db.collection("users").doc(data.userId).get();
        userInfo = userDoc.exists ? userDoc.data() : null;
      }

      return {
        id: doc.id,
        ...data,
        user: userInfo,
      };
    }));

    return res.status(200).json({ requests });
  } catch (error) {
    console.error("Error fetching support requests:", error);
    return res.status(500).json({ error: "Failed to fetch support requests" });
  }
};


// Messaging Functions
export const sendMessage = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { supportRequestId, receiverId, content, senderId } = req.body;

  try {
    if (!senderId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Validate the support request exists and is active
    const requestDoc = await db
      .collection("supportRequests")
      .doc(supportRequestId)
      .get();
    if (!requestDoc.exists || requestDoc.data()?.status === "closed") {
      return res.status(404).json({ error: "Support request not found or closed" });
    }

    const messageRef = db.collection("messages").doc();
    const timestamp = admin.firestore.Timestamp.now();

    const message: Message = {
      supportRequestId,
      senderId,
      receiverId,
      content,
      read: false,
      createdAt: timestamp,
    };

    await messageRef.set(message);

    // Update support request status if this is the first response
    if (requestDoc.data()?.status === "open") {
      await requestDoc.ref.update({
        status: "in-progress",
        updatedAt: timestamp,
      });
    }

    // Send push notification to receiver
    await sendPushNotification(receiverId, {
      title: "New Message",
      body: "You have received a new message",
      data: {
        type: "message",
        supportRequestId,
        messageId: messageRef.id,
      },
    });

    return res.status(201).json({
      message: "Message sent successfully",
      messageId: messageRef.id,
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to send message" });
  }
};

export const getMessages = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { supportRequestId } = req.params;
  const { userId } = req.body;

  try {
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Verify user is part of the conversation
    const requestDoc = await db
      .collection("supportRequests")
      .doc(supportRequestId)
      .get();
    if (!requestDoc.exists) {
      return res.status(404).json({ error: "Support request not found" });
    }

    const requestData = requestDoc.data();
    if (requestData?.userId !== userId && !await isHelper(userId, supportRequestId)) {
      return res.status(403).json({ error: "Unauthorized access to messages" });
    }

    const messagesSnapshot = await db
      .collection("messages")
      .where("supportRequestId", "==", supportRequestId)
      .orderBy("createdAt", "asc")
      .get();

    const messages = messagesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json({ messages });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch messages" });
  }
};

// Helper Functions
const notifyNearbyHelpers = async (
  location: { latitude: number; longitude: number },
  requestId: string
): Promise<void> => {
  try {
    // Get verified users within 5km radius
    const usersSnapshot = await db
      .collection("users")
      .where("verificationStatus", "==", "verified")
      .get();

    const nearbyUsers = usersSnapshot.docs.filter((doc) => {
      const userData = doc.data();
      const distance = getDistance(
        location,
        {
          latitude: userData.location.latitude,
          longitude: userData.location.longitude,
        }
      );
      return distance <= 5000; // 5km in meters
    });

    // Send push notifications to nearby users
    const notifications = nearbyUsers.map((user) => 
      sendPushNotification(user.id, {
        title: "🚨 Emergency Support Needed",
        body: "Someone nearby needs urgent assistance",
        data: {
          type: "emergency_request",
          requestId,
        },
      })
    );

    await Promise.all(notifications);
  } catch (error) {
    console.error("Failed to notify nearby helpers:", error);
  }
};

const isHelper = async (
  userId: string,
  supportRequestId: string
): Promise<boolean> => {
  const messagesSnapshot = await db
    .collection("messages")
    .where("supportRequestId", "==", supportRequestId)
    .where("senderId", "==", userId)
    .limit(1)
    .get();

  return !messagesSnapshot.empty;
};
