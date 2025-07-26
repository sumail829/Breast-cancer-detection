import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { createServer } from "http"; // ✅ new
import { Server } from "socket.io"; // ✅ new
import connectDB from "./config/db.js";
import { socketConnection } from "./socket.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import medicalRecordRoutes from "./routes/medicalRecordRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import chatRoutes from "./routes/chatRoutes.js"

import './socket.js'; // ✅ You’ll create this next

connectDB();

const app = express();
const httpServer = createServer(app); // ✅ create HTTP server

// Enable CORS & JSON
app.use(cors());
app.use(express.json());

// All routes
app.use("/api", doctorRoutes);
app.use("/api", patientRoutes);
app.use("/api", adminRoutes);
app.use("/api", medicalRecordRoutes);
app.use("/api", appointmentRoutes);
app.use("/api", notificationRoutes);
app.use("/api", chatRoutes);

app.use((req, res) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).send("Route not found");
});

// ✅ Setup Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: "*", // For now allow all. Use your frontend domain later
    methods: ["GET", "POST"],
  },
});

socketConnection(io); // ✅ use your socket logic here

// Start server
const PORT = 4000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server with Socket.IO running on port ${PORT}`);
});
