import { soldierRouter } from "./soldierRouter.js";
import { adminRouter } from "./adminRouter.js";
import { scoreRouter } from "./scoreRouter.js";
import { recordRouter } from "./recordRouter.js";

// ✅ path와 라우터를 객체 배열로 관리
const routers = [
    { path: "/soldiers", router: soldierRouter },
    { path: "/admins", router: adminRouter },
    { path: "/scores", router: scoreRouter },
    { path: "/records", router: recordRouter }
];

export default routers;