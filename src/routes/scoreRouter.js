import { Router } from "express";
import { getAllScores, getScore, addScore, updateScore, deleteScore } from "../controllers/scoreController.js";

const scoreRouter = Router();

scoreRouter.get("/", getAllScores);
scoreRouter.get("/:scoreId", getScore);
scoreRouter.post("/", addScore);
scoreRouter.patch("/:scoreId", updateScore);
scoreRouter.delete("/:scoreId", deleteScore);

export { scoreRouter };