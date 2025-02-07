import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    views: { type: Number, default: 0 },
}, { timestamps: true });

const note = mongoose.model("note", noteSchema);

module.exports = note;