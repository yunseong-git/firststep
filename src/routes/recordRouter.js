import { Router } from "express";
import { pagination } from "../middlewares/pagination.js";
import { checkAuth } from "../middlewares/checkAuth.js";

import { recordController } from "../controllers/recordController.js";

const recordRouter = Router();

recordRouter.get("/:mId", checkAuth, pagination, recordController.getRecords); //mid 병사 기록 리스트 보기
recordRouter.get("/:mId/:recordId", checkAuth, recordController.getDetails); //mid 병사의 recordId 기록보기

recordRouter.post("/", checkAuth, recordController.saveRecord); //mid 병사에 기록 추가

recordRouter.patch("/:mid/:recordId", checkAuth, recordController.updateRecord); // mid 병사에 recordId 기록수정

export { recordRouter };