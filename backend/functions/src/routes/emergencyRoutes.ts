import express from "express";
import {
  getEmergencyContacts,
  addEmergencyContact,
  updateEmergencyContact,
} from "../controllers/emergency";

const router = express.Router();

router.get("/", getEmergencyContacts);
router.post("/", addEmergencyContact);
router.put("/:countryCode/:type", updateEmergencyContact);

export default router;
