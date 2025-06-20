import mongoose from "mongoose";
import cors from "cors";
import express from "express";
import connectDB from "./config/db.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import medicalRecordRoutes from "./routes/medicalRecordRoutes.js"
import appointmentRoutes from "./routes/appointmentRoutes.js"
import notificationRoutes from "./routes/notificationRoutes.js"

connectDB();

const app=express();



app.use(cors());
app.use(express.json());

app.use("/api",doctorRoutes);

app.use("/api",patientRoutes);

app.use("/api",adminRoutes);

app.use("/api",medicalRecordRoutes);

app.use("/api",appointmentRoutes);

app.use("/api",notificationRoutes)

app.listen(4000,()=>{
    console.log(`server running on port 4000`)
} )
