import express from "express";
import { createAdmin, deleteSingleAdmin, getAllAdmin, getSingleAdmin, loginAdmin, updateSingleAdmin } from "../controllers/adminController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";

const router=express.Router();

router.post("/admin/signup",createAdmin);
router.post("/admin/login",loginAdmin);
router.get("/admin",verifyToken,authorizeRoles("admin"),getAllAdmin);
router.get("/admin/:id",getSingleAdmin);
router.patch("/admin/update/:id",updateSingleAdmin);
router.delete("/admin/delete/:id",deleteSingleAdmin)

export default router;