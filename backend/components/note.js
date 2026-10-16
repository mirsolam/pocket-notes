const { getDB } = require('./db');
const { checkAndUpdateSession } = require('./account')
const { ObjectId } = require('mongodb');

async function createNote(req, res) {
    try {
        const valid = await checkAndUpdateSession(req.cookies.sessionId)
        if (!valid) res.status(401).json({ status: "failed", message: "Session expired." })
        const note = await getDB()
            .collection('notes')
            .insertOne({ userId: req.cookies.userId, content: "" })
        res.status(200).json({ status: "success", data: note, message: "Note created successfully." })
    }
    catch (error) {
        res.status(500).json({ status: "failed", message: "Internal server error." })
    }
}

async function saveNote(req, res) {
    try {
        const valid = await checkAndUpdateSession(req.cookies.sessionId)
        if (!valid) res.status(401).json({ status: "failed", message: "Session expired." })
        const { _id, content } = req.body
        const note = await getDB()
            .collection('notes')
            .findOneAndUpdate(
                { _id: new ObjectId(_id) },
                { $set: { content: content } },
                { returnDocument: "after" }
            )
        res.status(200).json({ status: "success", data: note, message: "Note saved successfully." })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ status: "failed", message: "Internal server error." })
    }
}

async function getNote(req, res) {
    try {
        const valid = await checkAndUpdateSession(req.cookies.sessionId)
        if (!valid) res.status(401).json({ status: "failed", message: "Session expired." })
        const _id = req.params._id
        const note = await getDB()
            .collection('notes')
            .findOne(
                { _id: new ObjectId(_id) },
                { returnDocument: "after" }
            )
        res.status(200).json({ status: "success", data: note, message: "Note retrieved successfully." })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ status: "failed", message: "Internal server error." })
    }
}

async function deleteNote(req, res) {
    try {
        const valid = await checkAndUpdateSession(req.cookies.sessionId)
        if (!valid) res.status(401).json({ status: "failed", message: "Session expired." })
        const _id = req.params._id
        const note = await getDB()
            .collection('notes')
            .deleteOne(
                { _id: new ObjectId(_id) },
            )
        res.status(200).json({ status: "success", message: "Note deleted successfully." })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ status: "failed", message: "Internal server error." })
    }
}

module.exports = { createNote, saveNote, getNote, deleteNote };
