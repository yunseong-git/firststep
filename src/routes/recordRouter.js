import { Router } from "express";
import { getAllRecords, getRecord, addRecord, updateRecord, deleteRecord } from "../controllers/recordController.js";

const recordRouter = Router();

recordRouter.get("/", getAllRecords);
recordRouter.get("/:recordId", getRecord);
recordRouter.post("/", addRecord);
recordRouter.patch("/:recordId", updateRecord);
recordRouter.delete("/:recordId", deleteRecord);

export { recordRouter };