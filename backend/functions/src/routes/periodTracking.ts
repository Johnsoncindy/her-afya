import express from "express";
import {
  createOrUpdatePeriodData,
  getPeriodData,
  addCycle,
  addSymptom,
  updateInsights,
} from "../controllers/periodTracking";

const router = express.Router();

router.put("/period-data", createOrUpdatePeriodData);
router.get("/period-data/:userId", getPeriodData);
router.post("/cycles", addCycle);
router.post("/symptoms", addSymptom);
router.put("/insights", updateInsights);

export default router;
