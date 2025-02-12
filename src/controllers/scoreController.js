import mongoose from "mongoose";
import { Bscore, Pscore, Mscore } from "../models/evaluation"

async function saveScores(req, res, next) {
    try {
        res.status(201).json();
    } catch (err) {
        res.status(400).json({ message: err.message });
        next(err);
    }
}

async function getUnitScores(req, res, next) {
    try {
        res.status(201).json();
    } catch (err) {
        res.status(400).json({ message: err.message });
        next(err);
    }
}


