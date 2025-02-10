import mongoose from "mongoose";
import { record } from "../models/record"

/**병사 면담기록작성 */
async function saveRecord(req, res, next) {
    try {
        res.status(201).json();
    } catch (err) {
        res.status(400).json({ message: err.message });
        next(err);
    }
}

/**병사 면담기록 리스트 조회 */
async function getRecords(req, res, next) {
    try {
        res.status(201).json();
    } catch (err) {
        res.status(400).json({ message: err.message });
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

/**병사 면담기록 수정*/
async function updateRecord(req, res, next) {
    try {
        res.status(201).json();
    } catch (err) {
        res.status(400).json({ message: err.message });
        next(err);
    }
}

/**병사 면담기록 삭제*/
async function deleteRecord(req, res, next) {
    try {
        res.status(201).json();
    } catch (err) {
        res.status(400).json({ message: err.message });
        next(err);
    }
}