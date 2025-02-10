import mongoose from "mongoose";
import { admin } from "../models/admin";

/**관리자 등록, "all"권한만 가능 */
async function registerAdmin(req, res, next) {
    try {
        res.status(201).json();
    } catch (err) {
        res.status(400).json({ message: err.message });
        next(err);
    }
}

async function login(req, res, next) {
    try {
        res.status(201).json();
    } catch (err) {
        res.status(400).json({ message: err.message });
        next(err);
    }
}

async function logout(req, res, next) {
    try {
        res.status(201).json();
    } catch (err) {
        res.status(400).json({ message: err.message });
        next(err);
    }
}

/**관리자 수정, 본인만 가능 */
async function updateAdmin(req, res, next) {
    try {
        res.status(201).json();
    } catch (err) {
        res.status(400).json({ message: err.message });
        next(err);
    }
}

/**관리자 삭제, "all"권한만 가능 */
async function deleteAdmin(req, res, next) {
    try {
        res.status(201).json();
    } catch (err) {
        res.status(400).json({ message: err.message });
        next(err);
    }
}