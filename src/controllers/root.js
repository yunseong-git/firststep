import { admin } from "../models/admin.js";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

/** 신규 관리자 등록*/
async function registAdmin(req, res, next) {
    try {
        if (req.user.unit !== "all") {
            return res.status(403).json({ message: "권한이 없습니다." });
        }

        const { mId, password, position, rank, name, unit } = req.body;
        const saltRounds = parseInt(process.env.SALT) || 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password || mId, salt); // 기본 비밀번호 설정

        const newAdmin = new admin({ mId, password: hashedPassword, position, rank, name, unit });
        await newAdmin.save();

        res.status(201).json({ message: "관리자 등록 완료." }); // ✅ 201 Created
    } catch (err) {
        console.error("관리자 등록 중 오류 발생:", err);
        res.status(500).json({ message: "서버에서 오류가 발생했습니다." });
        next(err);
    }
}

/** 관리자 리스트 조회*/
async function getAllAdmin(req, res, next) {
    try {
        if (req.user.unit !== "all") {
            return res.status(403).json({ message: "권한이 없습니다." });
        }
        const adminList = await admin.find().select("mId position rank name unit -_id");

        res.status(200).json(adminList); // ✅ 200 OK로 변경
    } catch (err) {
        console.error("관리자 조회 중 오류 발생:", err);
        res.status(500).json({ message: "서버에서 오류가 발생했습니다." });
        next(err);
    }
}

/** 관리자 소속 변경 */
async function updateAdminUnit(req, res, next) {
    try {
        if (req.user.unit !== "all") {
            return res.status(403).json({ message: "권한이 없습니다." });
        }

        const { mId, newUnit } = req.body;
        const existingAdmin = await admin.findOne({ mId });

        if (!existingAdmin) {
            return res.status(404).json({ message: "해당 관리자를 찾을 수 없습니다." });
        }

        const result = await admin.updateOne({ mId }, { $set: { unit: newUnit } });

        if (result.matchedCount === 0) {
            return res.status(400).json({ message: "소속 변경 실패. 동일한 소속일 가능성이 있습니다." });
        }

        res.status(200).json({ message: "해당 관리자 소속 변경 완료." }); // ✅ 200 OK
    } catch (err) {
        console.error("관리자 소속 변경 중 오류 발생:", err);
        res.status(500).json({ message: "서버에서 오류가 발생했습니다." });
        next(err);
    }
}

/** 관리자 비밀번호 초기화 */
async function resetPassword(req, res, next) {
    try {
        if (req.user.unit !== "all") {
            return res.status(403).json({ message: "권한이 없습니다." });
        }

        console.log("✅ 요청 도착:", req.params); // 🔥 여기에 로그 추가해서 `req.params.mId` 값 확인

        const { mId } = req.params;
        console.log("✅ 비밀번호 초기화 대상 관리자 군번:", mId); // 👈 실제로 들어오는 값 확인

        if (!mId) {
            return res.status(400).json({ message: "mId가 제공되지 않았습니다" });
        }

        const saltRounds = parseInt(process.env.SALT) || 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const newPassword = await bcrypt.hash(mId, salt);

        const result = await admin.updateOne({ mId }, { $set: { password: newPassword } });

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "해당 관리자를 찾을 수 없습니다." });
        }

        res.status(201).json({ message: "해당 관리자 비밀번호 초기화 완료." });
    } catch (err) {
        console.error("비밀번호 초기화 중 오류 발생:", err);
        res.status(400).json({ message: "서버에서 오류가 발생했습니다." });
        next(err);
    }
}

/** 관리자 삭제 */
async function deleteAdmin(req, res, next) {
    try {
        if (req.user.unit !== "all") {
            return res.status(403).json({ message: "권한이 없습니다." });
        }

        const { mId } = req.body;
        const deletedAdmin = await admin.deleteOne({ mId });

        if (deletedAdmin.deletedCount === 0) {
            return res.status(404).json({ message: "삭제할 관리자가 존재하지 않습니다." });
        }

        res.status(204).send(); // 204 No Content (삭제 완료)
    } catch (err) {
        console.error("관리자 삭제 중 오류 발생:", err);
        res.status(500).json({ message: "서버에서 오류가 발생했습니다." });
        next(err);
    }
}

export const rootController = {
    registAdmin,
    getAllAdmin,
    resetPassword,
    updateAdminUnit,
    deleteAdmin,
};