import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB=async()=>{
    try {
        await mongoose.connect("mongodb+srv://umeshsah711:iLRrMWAGNDfDBqsJ@cluster0.2r8nhxw.mongodb.net/Breastcancer?retryWrites=true&w=majority&appName=Cluster0");
        console.log("database connection successfull")
    } catch (error) {
        console.log("Database connection error",error)
    }
}

export default connectDB;