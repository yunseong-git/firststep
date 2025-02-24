import { Router } from "express";
import { adminController } from "../controllers/adminController";
import { checkAuth } from "../middlewares/checkAuth";

const adminRouter = Router();

adminRouter.post("/login", (req, res, next) => {
    console.log("🚀 로그인 요청 들어옴:", req.body); // 요청 데이터 출력
    adminController.login(req, res, next);
});
adminRouter.get("/refresh", checkAuth, adminController.refresh) //로그인연장(토큰재발급)
adminRouter.get("/me", checkAuth, adminController.getAdminDetail); // 로그인한 관리자 정보 조회

adminRouter.get("/list", checkAuth, adminController.getAllAdmin); //모든 관리자 조회(root)
adminRouter.post("/newAdmin", checkAuth, adminController.registAdmin); //신규 관리자 등록(root)

adminRouter.patch("/unit", checkAuth, adminController.updateAdminUnit); //관리자 소속변경(root)
adminRouter.patch("/pwd/:adminId", checkAuth, adminController.resetPassword); //해당관리자 비밀번호 초기화(root)
adminRouter.patch("/pwd", checkAuth, adminController.updatePassword); //관리자 본인 비밀번호 변경
adminRouter.patch("/:adminId", checkAuth, adminController.updateAdmin); //관리자 본인 정보변경

adminRouter.delete("/", checkAuth, adminController.deleteAdmin); //관리자 삭제(root)


export { adminRouter };