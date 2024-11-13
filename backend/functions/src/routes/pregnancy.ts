import express from "express";
import {
  getPregnancyData,
  createPregnancyData,
  updatePregnancyData,
  addSymptom,
  addAppointment,
  addWeight,
  addKickCount,
  updateChecklist,
  addMemory,
} from "../controllers/pregnancy";

const router = express.Router();

router.get("/:userId", getPregnancyData);
router.post("/", createPregnancyData);
router.put("/:userId", updatePregnancyData);
router.post("/:userId/symptoms", addSymptom);
router.post("/:userId/appointments", addAppointment);
router.post("/:userId/weight", addWeight);
router.post("/:userId/kicks", addKickCount);
router.put("/:userId/checklist", updateChecklist);
router.post("/:userId/memories", addMemory);

export default router;
