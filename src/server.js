import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import routers from "./routes/routers";

dotenv.config();

const app = express();
const port = process.env.PORT;
const db_url = process.env.DB_URL;

const server = async () => {
    try {
        //보안 설정
        app.use(helmet());
        app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

        //미들웨어 설정
        app.use(cors());
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));

        //정적 파일 제공
        app.use(express.static(path.join(__dirname, "public")));
        app.use(express.static(path.join(__dirname, "views")));

        //데이터베이스
        mongoose.connect(db_url, { dbName: "project" })
            .then(() => console.log("MongoDB connected"))
            .catch((err) => console.error("MongoDB connection error:", err));

        //서버 실행
        app.listen(port, () => {
            console.log(`Server is running on ${port}`);
        });

        //라우터 등록
        routers.forEach(({ path, router }) => {
            app.use(path, router);
        });

        app.get("/", (req, res) => {
            res.sendFile(path.join(process.cwd(), "src", "views", "index.html"));
        });

        app.use((req, res) => {
            res.status(404).send("404 Not Found");
        });

    } catch (err) {
        console.log("Server Error", err);
    }
}

server();