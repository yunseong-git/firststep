import { Router } from "express";
import noteController from "../controllers/noteController";

const noteRouter = new Router();

noteRouter.get("/", noteController.getNoteList);
noteRouter.get("/:noteId", noteController.getNote);

noteRouter.post("/", noteController.createNote);

noteRouter.patch("/:noteId", noteController.updateNote);

noteRouter.delete("/:noteId", noteController.deleteNote);

module.exports = noteRouter;