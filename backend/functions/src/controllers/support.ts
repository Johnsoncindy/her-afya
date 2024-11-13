import {Request, Response} from "express";
import db from "../utils/db";
import {sendPushNotification} from "../services/notificationService";
import * as admin from "firebase-admin";

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

interface ChatPreview {
  id: string;
  supportRequestId: string;
  lastMessage: string;
  timestamp: admin.firestore.Timestamp;
  participantId: string;
  participantName: string;
  unreadCount: number;
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
  const {title, description, type, location, isEmergency, anonymous, userId} =
    req.body;

  // Validate required fields
  if (!title || !description || !type || !location) {
    return res.status(400).json({
      error: "Title, description, type, and location are required",
    });
  }

  try {
    if (!userId) {
      return res.status(401).json({error: "Unauthorized"});
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
      await notifyAllHelpers(requestRef.id);
    }

    return res.status(201).json({
      message: "Support request created successfully",
      requestId: requestRef.id,
    });
  } catch (error) {
    return res.status(500).json({error});
  }
};

export const getSupportRequests = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // Fetch only open support requests and order by creation time
    const snapshot = await db
      .collection("supportRequests")
      .where("status", "==", "open")
      .orderBy("createdAt", "desc")
      .get();

    // Map through each support request and add extra fields as needed
    const requests = await Promise.all(
      snapshot.docs.map(async (doc) => {
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
      })
    );

    return res.status(200).json({requests});
  } catch (error) {
    console.error("Error fetching support requests:", error);
    return res.status(500).json({error});
  }
};

// Messaging Functions
export const sendMessage = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const {supportRequestId, receiverId, content, senderId} = req.body;

  try {
    if (!senderId) {
      return res.status(401).json({error: "Unauthorized"});
    }

    // Validate the support request exists and is active
    const requestDoc = await db
      .collection("supportRequests")
      .doc(supportRequestId)
      .get();
    if (!requestDoc.exists || requestDoc.data()?.status === "closed") {
      return res
        .status(404)
        .json({error: "Support request not found or closed"});
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
    await sendPushNotification({
      token: receiverId,
      title: "New Message",
      message: "You have received a new message",
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
    return res.status(500).json({error});
  }
};

export const markMessagesAsRead = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const {supportRequestId, userId} = req.body;

  try {
    // Get unread messages for the user in the conversation
    const messagesSnapshot = await db
      .collection("messages")
      .where("supportRequestId", "==", supportRequestId)
      .where("receiverId", "==", userId)
      .where("read", "==", false)
      .get();

    // Batch update to mark messages as read
    const batch = db.batch();
    messagesSnapshot.docs.forEach((doc) => {
      batch.update(doc.ref, {read: true});
    });

    await batch.commit();

    return res.status(200).json({message: "Messages marked as read"});
  } catch (error) {
    console.error("Error marking messages as read:", error);
    return res.status(500).json({error});
  }
};

export const getMessages = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const {supportRequestId, userId} = req.params;

  try {
    if (!userId) {
      return res.status(401).json({error: "Unauthorized"});
    }

    // Verify user is part of the conversation
    const requestDoc = await db
      .collection("supportRequests")
      .doc(supportRequestId)
      .get();

    if (!requestDoc.exists) {
      return res.status(404).json({error: "Support request not found"});
    }

    const requestData = requestDoc.data();

    // Check if user is authorized
    let isUserHelper = false;
    try {
      isUserHelper = await isHelper(userId, supportRequestId);
    } catch (helperError) {
      console.error("Error checking helper status:", helperError);
      return res.status(500).json({error: "Failed to verify helper status"});
    }

    if (requestData?.userId !== userId && !isUserHelper) {
      return res.status(403).json({error: "Unauthorized access to messages"});
    }

    // Fetch messages related to the support request ID
    const messagesSnapshot = await db
      .collection("messages")
      .where("supportRequestId", "==", supportRequestId)
      .orderBy("createdAt", "asc")
      .get();

    // Map messages into a response format
    const messages = messagesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json({messages});
  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({error});
  }
};


// Helper Functions
const notifyAllHelpers = async (requestId: string): Promise<void> => {
  try {
    // Fetch all verified users
    const usersSnapshot = await db
      .collection("users")
      .where("verificationStatus", "==", "verified")
      .get();

    // Filter users that have a push token (to send notifications to them)
    const usersWithPushTokens = usersSnapshot.docs.filter((doc) => {
      const userData = doc.data();
      return userData.pushToken;
    });

    // Send push notifications to all users with a push token
    const notifications = usersWithPushTokens.map((user) =>
      sendPushNotification({
        token: user.data().pushToken,
        title: "🚨 Emergency Support Needed",
        message: "A sister needs urgent assistance.",
        data: {
          type: "emergency_request",
          requestId,
        },
      })
    );

    await Promise.all(notifications);
  } catch (error) {
    console.error("Failed to notify users:", error);
  }
};

// Helper function with try-catch block
const isHelper = async (
  userId: string,
  supportRequestId: string
): Promise<boolean> => {
  try {
    const messagesSnapshot = await db
      .collection("messages")
      .where("supportRequestId", "==", supportRequestId)
      .where("senderId", "==", userId)
      .limit(1)
      .get();

    return !messagesSnapshot.empty;
  } catch (error) {
    console.error("Error checking if user is a helper:", error);
    throw error;
  }
};

export const getChatPreviews = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const {userId} = req.params;

  try {
    if (!userId) {
      return res.status(401).json({error: "Unauthorized"});
    }

    // Get all messages where user is either sender or receiver
    const messagesSnapshot = await db
      .collection("messages")
      .where("senderId", "==", userId)
      .get();

    const receivedMessagesSnapshot = await db
      .collection("messages")
      .where("receiverId", "==", userId)
      .get();

    // Combine and process messages
    const allMessages = [
      ...messagesSnapshot.docs,
      ...receivedMessagesSnapshot.docs,
    ];

    // Group messages by support request
    const chatGroups = new Map<
      string,
      {
        messages: admin.firestore.QueryDocumentSnapshot[];
        participants: Set<string>;
      }
    >();

    allMessages.forEach((doc) => {
      const message = doc.data();
      const {supportRequestId, senderId, receiverId} = message;

      if (!chatGroups.has(supportRequestId)) {
        chatGroups.set(supportRequestId, {
          messages: [],
          participants: new Set([senderId, receiverId]),
        });
      }

      const group = chatGroups.get(supportRequestId)!;
      group.messages.push(doc);
    });

    // Create chat previews
    const chatPreviews: ChatPreview[] = await Promise.all(
      Array.from(chatGroups.entries()).map(
        async ([supportRequestId, group]) => {
          // Get last message
          const sortedMessages = group.messages.sort(
            (a, b) =>
              b.data().createdAt.toMillis() - a.data().createdAt.toMillis()
          );
          const lastMessage = sortedMessages[0].data();

          // Get participant info (the other user)
          const participantId = Array.from(group.participants).find(
            (id) => id !== userId
          )!;
          const participantDoc = await db
            .collection("users")
            .doc(participantId)
            .get();
          const participantData = participantDoc.data();

          // Count unread messages
          const unreadCount = sortedMessages.filter(
            (doc) => !doc.data().read && doc.data().receiverId === userId
          ).length;

          return {
            id: sortedMessages[0].id,
            supportRequestId,
            lastMessage: lastMessage.content,
            timestamp: lastMessage.createdAt,
            participantId,
            participantName: participantData?.displayName || "Anonymous",
            unreadCount,
          };
        }
      )
    );

    // Sort by most recent message
    chatPreviews.sort(
      (a, b) => b.timestamp.toMillis() - a.timestamp.toMillis()
    );

    return res.status(200).json({chatPreviews});
  } catch (error) {
    console.error("Error fetching chat previews:", error);
    return res.status(500).json({error});
  }
};
