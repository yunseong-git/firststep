import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import routers from "./routes/routers";

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
    app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })); // 요청 제한 (15분간 최대 100회)
    app.use(cors()); // CORS 활성화
    app.use(express.json()); // JSON 요청 본문 처리
    app.use(express.urlencoded({ extended: true })); // URL 인코딩된 요청 본문 처리
}

//정적 파일 제공
function setStaticFiles(app) {
    app.use(express.static(path.join(__dirname, "public")));
    app.use(express.static(path.join(__dirname, "views")));
}

//데이터베이스 연결
async function connectDatabase() {
    try {
        await mongoose.connect(process.env.DB_URL, { dbName: "first" });
        console.log("✅ MongoDB connected");
    } catch (err) {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1); // 연결 실패 시 서버 종료
    }
}

// ✅ 5. 라우터 등록 함수
function setRoutes(app) {
    routers.forEach(({ path, router }) => {
        app.use(path, router);
    });

    // 메인 페이지
    app.get("/", (req, res) => {
        res.sendFile(path.join(process.cwd(), "src", "views", "index.html"));
    });

    // 404 처리
    app.use((req, res) => {
        res.status(404).send("404 Not Found");
    });
}

//6. 서버 실행 함수
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