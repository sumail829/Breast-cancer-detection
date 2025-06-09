import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB=async()=>{
    try {
        await mongoose.connect("mongodb+srv://prabinyadav362:mKfyowYxQbVPABaM@cluster0.age3dux.mongodb.net/breastcancer?retryWrites=true&w=majority&appName=Cluster0");
        console.log("database connection successfull")
    } catch (error) {
        console.log("Database connection error",error)
    }
}

export default connectDB;