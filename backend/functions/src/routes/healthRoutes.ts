import express from "express";
import {addHealthTip, getHealthTips} from "../controllers/health";

const router = express.Router();

router.get("/health-tips", getHealthTips);
router.post("/create-tip", addHealthTip);

export default router;
