import { Router } from "express";
import { adminController } from "../controllers/admin.js";
import { checkAuth } from "../middlewares/checkAuth.js";

/**공통 및 일반관리자 routes*/
const admin = Router();

admin.post("/login", adminController.login);
admin.get("/refresh", checkAuth, adminController.refresh); //로그인연장(토큰재발급)

admin.get("/me", checkAuth, adminController.getAdminDetail); // 로그인한 관리자 정보 조회
admin.patch("/me", checkAuth, adminController.updateAdmin); //관리자 본인 정보변경

admin.patch("/pwd/force", adminController.updatePassword); //관리자 본인 비밀번호 변경(강제)
admin.patch("/pwd", checkAuth, adminController.updatePassword); //관리자 본인 비밀번호 변경(일반)

export { admin };