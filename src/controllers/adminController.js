import { admin } from "../models/admin";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

export const adminController = {
    registAdmin,
    login,
    refresh,
    getAllAdmin,
    resetPassword,
    updatePassword,
    updateAdmin,
    updateAdminUnit,
    deleteAdmin,
    getAdminDetail
}
/** 관리자 등록, "all" 권한만 가능 */
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

        res.status(201).json({ message: "관리자 등록 완료." });
    } catch (err) {
        console.error("관리자 등록 중 오류 발생:", err);
        res.status(500).json({ message: "서버에서 오류가 발생했습니다." });
        next(err);
    }
}

/** 관리자 로그인 */
async function login(req, res, next) {
    try {
        const { mId, password } = req.body;
        const accessAdmin = await admin.findOne({ mId }).select("+password"); // 비밀번호 포함하여 조회

        if (!accessAdmin) {
            return res.status(403).json({ message: "로그인 정보가 정확하지 않습니다." });
        }

        const isMatch = await bcrypt.compare(password, accessAdmin.password);
        if (!isMatch) {
            return res.status(403).json({ message: "로그인 정보가 정확하지 않습니다." });
        }

        const isDefaultPassword = await bcrypt.compare(mId, accessAdmin.password);
        if (isDefaultPassword) {
            return res.status(403).json({ message: "비밀번호 변경이 필요합니다. 비밀번호 변경 페이지로 이동해주세요." });
        }

        const token = jwt.sign({ mId: mId, unit: accessAdmin.unit }, process.env.JWT_SECRET, { expiresIn: "20m" });
        return res.status(201).json({ token, message: "로그인 성공." });
    } catch (err) {
        console.error("로그인 중 오류 발생:", err);
        res.status(500).json({ message: "서버에서 오류가 발생했습니다." });
        next(err);
    }
}


/**사용자가 버튼을 통해 refresh요청을 하면 새로운 토큰 발행 */
async function refresh(req, res, next) {
    try {
        const { mId, unit } = req.user;
        const newToken = jwt.sign({ mId: mId, unit: unit }, process.env.JWT_SECRET, { expiresIn: "20m" });
        res.status(201).json({ newToken });
    } catch (err) {
        console.error("토큰 재발급 중 오류 발생:", err);
        res.status(400).json({ message: "서버에서 오류가 발생했습니다." });
        next(err);
    }
}

/**관리자 전체 조회, "all"권한만 가능 */
async function getAllAdmin(req, res, next) {
    try {
        if (req.user.unit !== "all") {
            return res.status(403).json({ message: "권한이 없습니다." });
        }
        const adminList = await admin.find().select("mId position rank name unit -_id");

        res.status(201).json(adminList);
    } catch (err) {
        console.error("관리자 조회 중 오류 발생:", err);
        res.status(400).json({ message: "서버에서 오류가 발생했습니다." });
        next(err);
    }
}

/** 로그인한 관리자 정보 조회 */
async function getAdminDetail(req, res, next) {
    try {
        const { mId } = req.user; // 토큰에서 mId 가져오기

        const adminInfo = await admin.findOne({ mId }).select("position rank name -_id");

        if (!adminInfo) {
            return res.status(404).json({ message: "관리자를 찾을 수 없습니다." });
        }

        res.status(200).json(adminInfo);
    } catch (err) {
        console.error("관리자 조회 중 오류 발생:", err);
        res.status(500).json({ message: "서버에서 오류가 발생했습니다." });
        next(err);
    }
}

/**관리자 unit 변경, "all"권한만 가능 */
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

        await admin.updateOne({ mId }, { $set: { unit: newUnit } });

        res.status(201).json({ message: "해당 관리자 소속 변경 완료." });
    } catch (err) {
        console.error("관리자 소속 변경 중 오류 발생:", err);
        res.status(400).json({ message: "서버에서 오류가 발생했습니다." });
        next(err);
    }
}

/** 관리자 비밀번호 초기화, "all"권한만 가능 */
async function resetPassword(req, res, next) {
    try {
        if (req.user.unit !== "all") {
            return res.status(403).json({ message: "권한이 없습니다." });
        }

        const { mId } = req.params;
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

/** 관리자 비밀번호 변경 */
async function updatePassword(req, res, next) {
    try {
        const { mId } = req.user;
        const { currentPassword, newPassword } = req.body;

        const accessAdmin = await admin.findOne({ mId }).select("+password");
        const isMatch = await bcrypt.compare(currentPassword, accessAdmin.password);

        if (!isMatch) {
            return res.status(403).json({ message: "현재 비밀번호가 일치하지 않습니다." });
        }
        console.log("비밀번호 일치")
        // 기존 비밀번호와 같은 경우 방지
        const isSamePassword = await bcrypt.compare(newPassword, accessAdmin.password);
        if (isSamePassword) {
            return res.status(400).json({ message: "새 비밀번호는 기존 비밀번호와 달라야 합니다." });
        }

        const saltRounds = parseInt(process.env.SALT) || 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);

        await admin.updateOne({ mId }, { $set: { password: hashedNewPassword } });

        res.status(201).json({ message: "비밀번호 변경이 완료되었습니다. 변경 정보로 다시 로그인 해주세요." });
    } catch (err) {
        console.error("비밀번호 변경 중 오류 발생:", err);
        res.status(400).json({ message: "서버에서 오류가 발생했습니다." });
        next(err);
    }
}
/** 관리자 본인 정보변경 */
async function updateAdmin(req, res, next) {
    try {
        const { mId } = req.params;
        const allowedUpdates = ["position", "rank", "name"];
        const updateFields = {};

        allowedUpdates.forEach((field) => {
            if (req.body[field] !== undefined) {
                updateFields[field] = req.body[field];
            }
        });

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ message: "업데이트할 정보가 없습니다." });
        }

        const updatedAdmin = await admin.findOneAndUpdate(
            { mId },
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        if (!updatedAdmin) {
            return res.status(404).json({ message: "해당 관리자를 찾을 수 없습니다." });
        }

        res.status(200).json({ message: "관리자 정보 변경 완료", updatedAdmin });
    } catch (err) {
        console.error("정보 변경 중 오류 발생:", err);
        res.status(400).json({ message: err.message });
        next(err);
    }
}

/**관리자 삭제, "all"권한만 가능 */
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

        res.status(201).json({ message: "관리자 삭제 완료." });
    } catch (err) {
        console.error("관리자 삭제 중 오류 발생:", err);
        res.status(400).json({ message: "서버에서 오류가 발생했습니다." });
        next(err);
    }
}