import express from "express";
import {
  createMedicationReminder,
  getReminders,
} from "../controllers/reminder";

const router = express.Router();

router.get("/:userId", getReminders);
router.post("/:userId/medical", createMedicationReminder);

export default router;
