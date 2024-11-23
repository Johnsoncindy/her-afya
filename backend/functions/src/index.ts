import * as functions from "firebase-functions";
import express from "express";
import healthRoutes from "./routes/healthRoutes";
import resourcesRoutes from "./routes/resourcesRoutes";
import chatRoutes from "./routes/chatRoutes";
import emergencyRoutes from "./routes/emergencyRoutes";
import supportRoutes from "./routes/supportRoutes";
import authRoutes from "./routes/authRoutes";
import periodTracking from "./routes/periodTracking";
import pregnancyRoutes from "./routes/pregnancy";
import dataExportRoutes from "./routes/dataExport";
import remindersRoutes from "./routes/reminder";
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
app.use("/auth", authRoutes);
app.use("/period-tracking", periodTracking);
app.use("/pregnancy", pregnancyRoutes);
app.use("/reminders", remindersRoutes);
app.use("/data-export", dataExportRoutes);
/*
app.use('/health-tools', healthToolsRoutes);
app.use('/profile', profileRoutes); */

// Export as Firebase functions
export const api = functions.https.onRequest(app);
