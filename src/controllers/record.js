import mongoose from "mongoose";
import { record } from "../models/record.js"
import { soldier } from "../models/soldier.js";
//모든 면담기록은 본인 소속만 가능


/** 병사 면담기록 작성 */
async function saveRecord(req, res, next) {
    try {
        const { mId, date, interviewer, type, priority, content } = req.body;
        const adminUnit = req.user.unit; // 로그인한 관리자의 소속

        // ✅ 해당 병사가 존재하는지 확인
        const soldierExists = await soldier.findOne({ mId });
        if (!soldierExists) {
            return res.status(404).json({ message: "해당 병사가 존재하지 않습니다." });
        }

        // ✅ 기존 기록이 있는지 확인
        let existingRecord = await record.findOne({ mId });

        if (!existingRecord) {
            // 기존 기록이 없으면 새 문서 생성
            existingRecord = new record({ mId, records: [] });
        }

        // ✅ 새 면담 기록 추가
        existingRecord.records.push({ date, interviewer, type, priority, content });
        await existingRecord.save();

        console.log("면담기록 등록 완료:", existingRecord);
        res.status(201).json(existingRecord);
    } catch (err) {
        console.error("면담 기록 저장 중 오류 발생:", err);
        res.status(400).json({ message: "면담 기록 저장 중 오류 발생" });
        next(err);
    }
}

/** 병사 면담기록 리스트 조회 */
async function getRecords(req, res, next) {
    try {
        const adminUnit = req.user.unit; // 로그인한 관리자의 소속
        const { mId } = req.params;
        const { skip, limit } = req.pagination;
        const { sortBy } = req.query;

        // ✅ 병사 정보 확인
        const soldierInfo = await soldier.findOne({ mId }).select("unit");
        if (!soldierInfo) {
            return res.status(404).json({ message: "해당 병사가 존재하지 않습니다." });
        }

        // ✅ 접근 권한 확인
        if (adminUnit !== "all" && adminUnit !== soldierInfo.unit) {
            return res.status(403).json({ message: "접근 권한이 없습니다." });
        }

        // ✅ 정렬 옵션 (기본: 최신순)
        let sortOption = { "records.date": -1 };
        if (sortBy === "priority") {
            sortOption = { "records.priority": -1 }; // 중요도순 정렬

        }

        // ✅ 면담 기록 조회
        const recordData = await record.findOne({ mId }).select("records");
        if (!recordData || recordData.records.length === 0) {
            return res.status(200).json({ records: [] });
        }

        // ✅ 페이지네이션 적용
        const paginatedRecords = recordData.records
            .sort((a, b) => (sortBy === "priority" ? b.priority - a.priority : new Date(b.date) - new Date(a.date)))
            .slice(skip, skip + limit);

        res.status(200).json({
            records: paginatedRecords,
            totalRecords: recordData.records.length
        });
    } catch (err) {
        console.error("면담 기록 조회 중 오류 발생:", err);
        res.status(500).json({ message: "서버 오류 발생" });
        next(err);
    }
}

/** 병사 면담기록 자세히 보기 */
async function getDetails(req, res, next) {
    try {
        const { mId, recordId } = req.params;
        const adminUnit = req.user.unit;

        // ✅ 해당 병사의 면담 기록 조회
        const recordData = await record.findOne({ mId });
        if (!recordData) {
            return res.status(404).json({ message: "해당 병사의 면담 기록이 존재하지 않습니다." });
        }

        // ✅ 특정 기록 찾기
        const selectedRecord = recordData.records.id(recordId);
        if (!selectedRecord) {
            return res.status(404).json({ message: "해당 면담 기록을 찾을 수 없습니다." });
        }

        // ✅ 병사의 소속 확인 후 접근 제한
        const soldierInfo = await soldier.findOne({ mId }).select("unit");
        if (adminUnit !== "all" && adminUnit !== soldierInfo.unit) {
            return res.status(403).json({ message: "해당 병사의 면담 기록에 접근할 권한이 없습니다." });
        }

        res.status(200).json(selectedRecord);
    } catch (err) {
        console.error("면담 기록 상세 조회 중 오류 발생:", err);
        res.status(500).json({ message: "서버 오류 발생" });
        next(err);
    }
}

/** 병사 면담기록 수정 */
async function updateRecord(req, res, next) {
    try {
        const { mId, recordId } = req.params;
        const { date, interviewer, type, priority, content } = req.body;

        console.log("✅ 수정 요청 - mId:", mId);
        console.log("✅ 수정 요청 - recordId:", recordId);

        // ✅ ObjectId 변환 (recordId가 MongoDB의 ObjectId라면 변환해야 함)
        const recordObjectId = new mongoose.Types.ObjectId(recordId);

        // ✅ 해당 병사의 records 배열에서 특정 recordId를 가진 요소 찾기
        const updatedRecord = await record.findOneAndUpdate(
            { mId, "records._id": recordObjectId },
            {
                $set: {
                    "records.$.date": date,
                    "records.$.interviewer": interviewer,
                    "records.$.type": type,
                    "records.$.priority": priority,
                    "records.$.content": content
                }
            },
            { new: true }
        );

        if (!updatedRecord) {
            console.error("❌ 수정할 면담 기록을 찾을 수 없음:", { mId, recordId });
            return res.status(404).json({ message: "해당 면담 기록을 찾을 수 없습니다." });
        }

        res.status(200).json({ message: "면담 기록이 수정되었습니다.", updatedRecord });
    } catch (err) {
        console.error("❌ 면담 기록 수정 중 오류 발생:", err);
        res.status(500).json({ message: "서버 오류 발생" });
        next(err);
    }
}

export const recordController = {
    saveRecord,
    getRecords,
    getDetails,
    updateRecord,
};