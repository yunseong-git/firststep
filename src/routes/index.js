import { soldier } from "./soldier.js";
import { root } from "./root.js";
import { record } from "./record.js";
import { admin } from "./admin.js";

import { Router } from "express";

//path와 라우터를 객체 배열로 관리
const routers = Router();

routers.use("/admins", admin);
routers.use("/roots", root);
routers.use("/soldiers", soldier);
routers.use("/records", record);

export default routers;