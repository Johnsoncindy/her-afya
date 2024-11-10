import express from "express";
import {
  createSupportRequest,
  getMessages,
  getSupportRequests,
  sendMessage,
} from "../controllers/support";

const router = express.Router();

router.post("/support-requests", createSupportRequest);
router.get("/support-requests", getSupportRequests);
router.post("/messages", sendMessage);
router.get("/messages/:supportRequestId", getMessages);

export default router;
