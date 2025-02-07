import note from "../models/note";
import mongoose from "mongoose";

async function createNote(req, res, next) {
    try {
        const newNote = await note.create({
            title: req.body.title,
            content: req.body.content,
        });
        console.log(newNote);
        res.status(201).json(newNote);
    } catch (err) {
        res.status(400).json({ message: err.message });
        next(err);
    }
}

async function getNoteList(req, res) {
    try {
        const notes = await note.find();
        res.status(200).json(notes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

async function getNote(req, res) {
    try {
        const noteId = req.params.noteId;
        const notes = await note.findById(noteId);
        res.status(200).json(notes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

async function updateNote(req, res) {
    try {
        const {noteId} = req.params;
        const updatedNote = await note.findByIdAndUpdate(noteId,
            {
                title: req.body.title,
                content: req.body.content,
            }
        );
        res.status(200).json(updatedNote);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

async function deleteNote(req, res) {
    try {
        const {noteId} = req.params;
        const deletedNote = await note.findByIdAndDelete(noteId);
        res.status(200).json(deletedNote);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = {
    createNote,
    getNoteList,
    getNote,
    updateNote,
    deleteNote,
};
