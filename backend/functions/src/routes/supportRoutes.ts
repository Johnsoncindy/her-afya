import express from "express";
import {
  createSupportRequest,
  getChatPreviews,
  getMessages,
  getSupportRequests,
  markMessagesAsRead,
  sendMessage,
} from "../controllers/support";

const router = express.Router();

router.post("/support-requests", createSupportRequest);
router.get("/support-requests", getSupportRequests);
router.post("/messages", sendMessage);
router.get("/messages/:supportRequestId/:userId", getMessages);
router.get("/chat-previews/:userId", getChatPreviews);
router.post("/mark-read", markMessagesAsRead);

export default router;
