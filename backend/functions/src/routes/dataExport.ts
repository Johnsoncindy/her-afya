import express from "express";
import {exportUserDataAsPDF} from "../controllers/dataExport";

const router = express.Router();
router.get("/:userId/pdf", exportUserDataAsPDF);

export default router;
