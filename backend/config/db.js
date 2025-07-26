import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB=async()=>{
    try {
        await mongoose.connect("mongodb+srv://samirpanjiyar4:1HdyaulcDjEBLUVw@cluster0.dzwtsms.mongodb.net/breastCancer?retryWrites=true&w=majority&appName=Cluster0");
        console.log("database connection successfull")
    } catch (error) {
        console.log("Database connection error",error)
    }
}

export default connectDB;