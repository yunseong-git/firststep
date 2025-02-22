import { Router } from "express";
import { soldierController } from "../controllers/soldierController"
import { checkAuth } from "../middlewares/checkAuth";
import { pagination } from "../middlewares/pagination";

const soldierRouter = new Router();

soldierRouter.get("/:orderby", checkAuth, pagination, soldierController.getAllSoldiers); //모든 병사정보 리스트로 나열(소대별/군번순),로그인 완료시 메인페이지

soldierRouter.get("/details/:mId", checkAuth, soldierController.getSoldier); //mId 병사정보 자세히보기

soldierRouter.post("/newSoldier", checkAuth, soldierController.saveSoldier); //신규 병사 등록

soldierRouter.patch("/:mId", checkAuth, soldierController.updateSoldier); //병사 정보 수정

soldierRouter.delete("/:mId", checkAuth, soldierController.deleteSoldier); //병사 정보 일괄 삭제(cascade delete)

export { soldierRouter };