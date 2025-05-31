import express from "express";
import { createAdmin, getAllAdmin, loginAdmin } from "../controllers/adminController.js";


const router=express.Router();

router.post("/admin/signup",createAdmin);
router.post("/admin/login",loginAdmin);
router.get("/admin",getAllAdmin)

export default router;