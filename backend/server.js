
import 'dotenv/config';
import cookieParser from "cookie-parser";

import cors from "cors";
import express from "express";
import connectDB from "./config/db.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import medicalRecordRoutes from "./routes/medicalRecordRoutes.js"
import appointmentRoutes from "./routes/appointmentRoutes.js"
import doctorAuthRoutes from "./routes/doctorAuthRoutes.js";

connectDB();

const app=express();


app.use(cors({ origin: "http://localhost:3000" , credentials: true}));
app.use(express.json());
 app.use(cookieParser());

//Api Endpoints 
app.get('/', (req, res) => res.send ("API WORKING"));

app.use("/api",doctorRoutes);

app.use("/api",doctorAuthRoutes)

app.use("/api",patientRoutes);

app.use("/api",adminRoutes);

app.use("/api",medicalRecordRoutes);

app.use("/api",appointmentRoutes);

app.listen(4000,()=>{
    console.log(`server running on port 4000`)
} )
