const { getDB } = require('./db');
const { checkAndUpdateSession } = require('./account')
const { ObjectId } = require('mongodb');
const { title } = require('process');

async function createNotebook(req, res) {
    try {
        const valid = await checkAndUpdateSession(req.cookies.sessionId)
        if (!valid) res.status(401).json({ status: "failed", message: "Session expired." })
        const note = await getDB()
            .collection('notebooks')
            .insertOne({ userId: req.cookies.userId, title: "", currentLeft: 0, currentRight: 1, content: ["", ""] })
        res.status(200).json({ status: "success", data: note, message: "Notebook created successfully." })
    }
    catch (error) {
        res.status(500).json({ status: "failed", message: "Internal server error." })
    }
}

async function saveNotebook(req, res) {
    try {
        const valid = await checkAndUpdateSession(req.cookies.sessionId)
        if (!valid) res.status(401).json({ status: "failed", message: "Session expired." })
        const { _id, title, currentLeft, currentRight, content } = req.body
        const note = await getDB()
            .collection('notebooks')
            .findOneAndUpdate(
                { _id: new ObjectId(_id) },
                { $set: { title: title, currentLeft: currentLeft, currentRight: currentRight, content: content } },
                {
                    projection: { userId: 0 },
                    returnDocument: "after"
                }
            )
        res.status(200).json({ status: "success", data: note, message: "Notebook saved successfully." })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ status: "failed", message: "Internal server error." })
    }
}

async function getNotebook(req, res) {
    try {
        const valid = await checkAndUpdateSession(req.cookies.sessionId)
        if (!valid) res.status(401).json({ status: "failed", message: "Session expired." })
        const _id = req.params._id
        const note = await getDB()
            .collection('notebooks')
            .findOne(
                { _id: new ObjectId(_id) },
                { returnDocument: "after" },
                { projection: { userId: 0 } }
            )
        res.status(200).json({ status: "success", data: note, message: "Notebook retrieved successfully." })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ status: "failed", message: "Internal server error." })
    }
}

async function deleteNotebook(req, res) {
    try {
        const valid = await checkAndUpdateSession(req.cookies.sessionId)
        if (!valid) res.status(401).json({ status: "failed", message: "Session expired." })
        const _id = req.params._id
        const note = await getDB()
            .collection('notebooks')
            .deleteOne(
                { _id: new ObjectId(_id) },
            )
        res.status(200).json({ status: "success", message: "Notebook deleted successfully." })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ status: "failed", message: "Internal server error." })
    }
}

module.exports = { createNotebook, saveNotebook, getNotebook, deleteNotebook };
