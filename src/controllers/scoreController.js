import mongoose from "mongoose";
import { Bscore, Pscore, Mscore } from "../models/score"

async function mSave(req, res, next) {
    try {
        res.status(201).json();
    } catch (err) {
        res.status(400).json({ message: err.message });
        next(err);
    }
}

async function bSave(req, res, next) {
    try {
        res.status(201).json();
    } catch (err) {
        res.status(400).json({ message: err.message });
        next(err);
    }
}

async function pSave(req, res, next) {
    try {
        res.status(201).json();
    } catch (err) {
        res.status(400).json({ message: err.message });
        next(err);
    }
}

async function getAllScoresM(req, res, next) {
    try {
        res.status(201).json();
    } catch (err) {
        res.status(400).json({ message: err.message });
        next(err);
    }
}

async function getAllScoresB(req, res, next) {
    try {
        res.status(201).json();
    } catch (err) {
        res.status(400).json({ message: err.message });
        next(err);
    }
}

async function getAllScoresP(req, res, next) {
    try {
        res.status(201).json();
    } catch (err) {
        res.status(400).json({ message: err.message });
        next(err);
    }
}

async function mGet(req, res, next) {
    try {
        res.status(201).json();
    } catch (err) {
        res.status(400).json({ message: err.message });
        next(err);
    }
}


