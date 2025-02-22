import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function checkAuth(req, res, next) {
    try {
        const token = req.headers.authorization.split(" ")[1]; // Bearer Token

        if (!token) return res.status(401).json({ message: "로그인이 필요합니다." });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded; // 로그인된 사용자 정보 저장
        next();
    } catch (err) {
        res.status(401).json({ message: "유효하지 않은 토큰입니다." });
    }
}