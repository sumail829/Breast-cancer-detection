import Admin from "../models/admin.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import 'dotenv/config';
import mongoose from "mongoose";

export const createAdmin = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: "All the field must be filled" })
        }
        
        const adminExists = await Admin.findOne({email:email});
        if(adminExists){
            return res.status(400).json({message:"admin with this email already exists"})
        }
        const salt=await bcrypt.genSalt(10);
        const hashedpassword=await bcrypt.hash(password,salt);
        const newAdmin = new Admin({
            firstName,
            lastName,
            email,
            password:hashedpassword,
            role: "admin"
        }).save();
              return res.status(201).json({message:"Admin created",admin:newAdmin})
    } catch (error) {
        console.error("Error creating Admin:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "email and password must be provided" })
        }
        const admin = await Admin.findOne({ email: email })
        if (!admin) {
            return res.status(404).json({ message: "No admin found" })
        }
        const isMatch=await bcrypt.compare(password,admin.password);
        if(!isMatch){
            return res.status(401).json({message:"Invalid credential"});
        }
        const token = jwt.sign({id:admin._id, role: admin.role}, process.env.JWT_SECRET,{expiresIn:"30d"});
        const { password: _, ...adminWithoutPassword } = admin._doc; // Exclude password from response
        return res.status(200).json({ message: "Login successful",token, admin:adminWithoutPassword });
    } catch (error) {
        console.error("Error login Admin:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getAllAdmin = async (req, res) => {
    try {
        const fetchAllAdmin = await Admin.find();
        if (fetchAllAdmin.length === 0) {
            return res.status(404).json({ message: "No admin found" })
        }
        return res.status(200).json({ message: "All admin fetched successfully", fetchAllAdmin })
    } catch (error) {
        console.error("Error fetching doctors:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getSingleAdmin = async (req, res) => {
    try {
        const fetchSingleAdmin = await Admin.findById(req.params.id);
        if (!fetchSingleAdmin) {
            return res.status(404).json({ message: "No admin found" })
        }
        return res.status(200).json({ message: " admin fetched successfully", fetchSingleAdmin })
    } catch (error) {
        console.error("Error fetching doctors:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const updateSingleAdmin = async (req, res) => {
    try {
        const{firstName,lastName,email,password}=req.body;
        const updateSingleAdmin = await Admin.findByIdAndUpdate(req.params.id,{firstName,lastName,email,password},{new:true});
        if (!updateSingleAdmin) {
            return res.status(404).json({ message: "No admin found" })
        }
        return res.status(200).json({ message: "admin updated successfully", updateSingleAdmin })
    } catch (error) {
        console.error("Error Updating doctors:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteSingleAdmin=async(req,res)=>{
    try {
        const deleteAdmin=await Admin.findByIdAndDelete(req.params.id);
        if(!deleteAdmin){
            return res.status(404).json({message:"No Admin found"})
        }
        return res.status(200).json({message:"Admin deleted succesfully",deleteAdmin})
    } catch (error) {
        console.error("Error Deleting doctors:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

