import mongoose from "mongoose";
import { record } from "../models/record"
import { soldier } from "../models/soldier";
//모든 면담기록은 본인 소속만 가능

export const recordController = {
    saveRecord,
    getRecords,
    getDetails,
    updateRecord,
}
/**병사 면담기록작성 */
async function saveRecord(req, res, next) {
    try {
        const unit = req.user
        const { mId } = req.body;

        const newRecord = new record({
            mId: req.body.mId,
            unit: req.body.unit,
        })

        await newRecord.save();

        console.log("면담기록 등록 완료:", newRecord);
        res.status(201).json(newRecord);
    } catch (err) {
        res.status(400).json({ message: err.message });
        next(err);
    }
}

/** 병사 면담기록 리스트 조회 */
async function getRecords(req, res, next) {
    try {
        const adminUnit = req.user.unit; // req.user.unit을 가져와야 함
        const { mId, unit } = req.params;
        const { skip, limit } = req.pagination;
        const { sortBy } = req.query;

        //접근권한 확인
        if (adminUnit !== "all" && adminUnit !== unit) {
            return res.status(403).json({ message: "접근 권한이 없습니다." });
        }

        const sortOption = { "records.date": -1 }; // 기본 날짜순 (최신순)
        if (sortBy === "priority") {
            sortOption = { "records.priority": -1 }; // 중요도순 (높은 점수 순)
        }

        // 면담 기록 조회
        const records = await record.findOne({ mId })
            .select("records.date records.title records.interviewer records.priority")
            .sort(sortOption)
            .slice("records.date records.title records.interviewer records.priority", [skip, limit]);

        if (!records) {
            return res.status(404).json({ message: "면담 기록이 없습니다." });
        }

        res.status(200).json(records);
    } catch (err) {
        res.status(500).json({ message: "서버 오류 발생" });
        next(err);
    }
}

/**병사 면담기록 자세히 보기 */
async function getDetails(req, res, next) {
    try {
        res.status(201).json();
    } catch (err) {
        res.status(400).json({ message: err.message });
        next(err);
    }
}

/**병사 면담기록 수정*/
async function updateRecord(req, res, next) {
    try {
        res.status(201).json();
    } catch (err) {
        res.status(400).json({ message: err.message });
        next(err);
    }
}