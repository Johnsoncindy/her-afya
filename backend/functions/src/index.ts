import * as functions from "firebase-functions";
import express from "express";
import healthRoutes from "./routes/healthRoutes";
import resourcesRoutes from "./routes/resourcesRoutes";
import chatRoutes from "./routes/chatRoutes";
import emergencyRoutes from "./routes/emergencyRoutes";
import supportRoutes from "./routes/supportRoutes";
/*
import healthToolsRoutes from './routes/healthToolsRoutes';
import profileRoutes from './routes/profileRoutes'; */

const app = express();

// Use each route file
app.use("/health", healthRoutes);
app.use("/resources", resourcesRoutes);
app.use("/api", chatRoutes);
app.use("/emergency-contacts", emergencyRoutes);
app.use("/support", supportRoutes);
/*
app.use('/health-tools', healthToolsRoutes);
app.use('/profile', profileRoutes); */

// Export as Firebase functions
export const api = functions.https.onRequest(app);
