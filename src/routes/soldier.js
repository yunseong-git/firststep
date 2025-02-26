import { Router } from "express";
import { soldierController } from "../controllers/soldier"
import { checkAuth } from "../middlewares/checkAuth";
import { pagination } from "../middlewares/pagination";

const soldier = new Router();

soldier.get("/", checkAuth, pagination, soldierController.getAllSoldiers); //모든 병사정보 리스트로 나열(소대별/군번순),로그인 완료시 메인페이지
soldier.get("/detail/:mId", checkAuth, soldierController.getSoldierDetail); //mId 병사정보 자세히보기

soldier.post("/newSoldier", checkAuth, soldierController.saveSoldier); //신규 병사 등록
soldier.patch("/updateSoldier/:mId", checkAuth, soldierController.updateSoldier); //병사 정보 수정

export { soldier };