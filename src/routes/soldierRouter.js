import { Router } from "express";
import { soldierController } from "../controllers/soldierController"

const soldierRouter = new Router();

soldierRouter.get("/", soldierController.getAllSoldiers);
soldierRouter.get("/:mId", soldierController.getSoldier);

soldierRouter.post("/", soldierController.saveSoldier);

soldierRouter.patch("/:mId", soldierController.updateSoldier);

soldierRouter.delete("/:mId", soldierController.deleteSoldier);

export { soldierRouter };