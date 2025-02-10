import { Router } from "express";
import { getAllAdmins, getAdmin, createAdmin, updateAdmin, deleteAdmin } from "../controllers/adminController.js";

const adminRouter = Router();

adminRouter.get("/", getAllAdmins);
adminRouter.get("/:adminId", getAdmin);
adminRouter.post("/", createAdmin);
adminRouter.patch("/:adminId", updateAdmin);
adminRouter.delete("/:adminId", deleteAdmin);

export { adminRouter };