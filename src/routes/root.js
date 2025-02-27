import { Router } from "express";
import { rootController } from "../controllers/root.js";
import { checkAuth } from "../middlewares/checkAuth.js";

/**all 권한 전용 routes*/
const root = Router();

root.get("/list", checkAuth, rootController.getAllAdmin); //모든 관리자 조회

root.post("/newAdmin", checkAuth, rootController.registAdmin); //신규 관리자 등록

root.patch("/unit", checkAuth, rootController.updateAdminUnit); //관리자 소속변경
root.patch("/pwd/:mId", checkAuth, rootController.resetPassword); //해당관리자 비밀번호 초기화

root.get("/", checkAuth, rootController.deleteAdmin); //관리자 삭제

export { root };