import { Router } from "express";
import { pagination } from "../middlewares/pagination.js";
import { checkAuth } from "../middlewares/checkAuth.js";

import { recordController } from "../controllers/record.js";

const record = Router();

record.get("/:mId", checkAuth, pagination, recordController.getRecords); //mid 병사 기록 리스트 보기
record.get("/:mId/:recordId", checkAuth, recordController.getDetails); //mid 병사의 recordId 기록보기

record.post("/", checkAuth, recordController.saveRecord); //mid 병사에 기록 추가

record.patch("/:mId/:recordId", checkAuth, recordController.updateRecord); // mid 병사에 recordId 기록수정

export { record };