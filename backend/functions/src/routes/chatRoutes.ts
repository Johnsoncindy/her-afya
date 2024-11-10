import express from "express";
import {chatWithGeminiHandler} from "../controllers/chat";

const router = express.Router();

router.post("/chat", chatWithGeminiHandler);

export default router;
