import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import routers from "./routes/index.js";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

//환경변수 점검
function checkEnv() {
    const requiredVars = ["PORT", "DB_URL", "SALT", "JWT_SECRET", "API_BASE_URL"];
    const missingVars = requiredVars.filter((key) => !process.env[key]);

    if (missingVars.length > 0) {
        throw new Error(`🚨 환경변수 누락: ${missingVars.join(", ")}`);
    }
}

//보안 및 미들웨어 설정
function setMiddleware(app) {
    app.use(helmet()); // 보안 강화
    const limiter = rateLimit({
        windowMs: 1 * 60 * 1000, // 1분
        max: 100, // 최대 100회
        message: "경고: 너무 많은 요청이 감지되었습니다. 잠시 후 다시 시도하세요."
    });
    app.use(cors()); // CORS 활성화
    app.use(express.json()); // JSON 요청 본문 처리
    app.use(express.urlencoded({ extended: true })); // URL 인코딩된 요청 본문 처리
}
function setStaticFiles(app) {
    // ✅ 운영체제(OS)에 따라 `src/public` 경로 설정
    const publicPath = path.join(__dirname, "public");  // 🔥 src 내부의 public을 지정

    // ✅ 정적 파일 제공 (CSS, JS, 이미지)
    app.use(express.static(publicPath));

    // ✅ `views` 폴더는 `/` 루트에서 접근 가능하도록 설정
    app.use("/", express.static(path.join(publicPath, "views")));

    // ✅ 개별 정적 경로 추가 (CSS, Scripts 등)
    app.use("/css", express.static(path.join(publicPath, "css")));
    app.use("/scripts", express.static(path.join(publicPath, "scripts")));

    // ✅ 로그로 경로 확인
    console.log("✅ Serving static files from:", path.join(publicPath, "views"));
    console.log("✅ Static file directories:");
    console.log("   - / (Views) ->", path.join(publicPath, "views"));
    console.log("   - /css ->", path.join(publicPath, "css"));
    console.log("   - /scripts ->", path.join(publicPath, "scripts"));
}

//데이터베이스 연결
async function connectDatabase() {
    try {
        await mongoose.connect(process.env.DB_URL, { dbName: "MDB" });
        console.log("✅ MongoDB connected");
    } catch (err) {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1); // 연결 실패 시 서버 종료
    }
}

function setRoutes(app) {
    app.use("/", routers);

    // ✅ 메인 페이지 기본 경로
    app.get("/", (req, res) => {
        res.sendFile(path.join(__dirname, "src", "public", "views", "login.html"));
    });

    // ✅ 404 처리
    app.use((req, res) => {
        console.log(`❌ 404 Not Found: ${req.url}`);  // 요청 경로 확인
        res.status(404).send("404 Not Found");
    });
}
//서버 실행
function startServer(app) {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
}

//서버 초기화 및 실행
async function initializeServer() {
    try {
        checkEnv(); // 환경변수 점검

        const app = express(); // Express 앱 생성

        setMiddleware(app); // 미들웨어 설정

        setStaticFiles(app); // 정적 파일 제공

        await connectDatabase(); // DB 연결

        setRoutes(app); // 라우터 설정

        startServer(app); // 서버 실행
    } catch (err) {
        console.error("❌ Server initialization failed:", err);
        process.exit(1);
    }
}

// 서버 실행
initializeServer();