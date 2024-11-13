import express from "express";
import {createUser, savePushToken} from "../controllers/auth";

const router = express.Router();

// Add new health article/resource
router.post("/create-user", createUser);
router.put("/:userId/push-token", savePushToken);

export default router;
