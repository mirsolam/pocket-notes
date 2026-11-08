const { getDB } = require('./db');
const { checkAndUpdateSession } = require('./account')
const { ObjectId } = require('mongodb');
const { title } = require('process');
const { encryptContent, decryptContent } = require('./note');
const { get_db } = require('../sqlite-database');

async function createNotebook(req, res) {
    try {
        const valid = await checkAndUpdateSession(req.cookies.sessionId)
        if (!valid) return res.status(401).json({ status: "failed", message: "Session expired." })
        /*const notebook = await getDB()
            .collection('notebooks')
            .insertOne({ userId: req.cookies.userId, title: "", currentLeft: 0, currentRight: 1, content: ["", ""] })*/ //MongoDB

        const conn = get_db()
        const notebook = conn.prepare(`INSERT INTO notebooks (userId) VALUES (?) RETURNING _id`).get(req.cookies.userId)
        conn.close()

        return res.status(200).json({ status: "success", data: notebook, message: "Notebook created successfully." })
    }
    catch (error) {
        return res.status(500).json({ status: "failed", message: "Internal server error." })
    }
}

async function saveNotebook(req, res) {
    try {
        const valid = await checkAndUpdateSession(req.cookies.sessionId)
        if (!valid) return res.status(401).json({ status: "failed", message: "Session expired." })
        const { _id, title, currentLeft, currentRight, content } = req.body
        content.map((item, index) => {
            if (content[index].length > 0) content[index] = encryptContent(content[index])
        })
        /*const notebook = await getDB()
            .collection('notebooks')
            .findOneAndUpdate(
                { _id: new ObjectId(_id) },
                { $set: { title: title, currentLeft: currentLeft, currentRight: currentRight, content: content } },
                {
                    projection: { userId: 0 },
                    returnDocument: "after"
                }
            )*/ //MongoDB

        const conn = get_db()
        const notebook = conn.prepare(`UPDATE notebooks SET title = ?, currentLeft = ?, currentRight = ?, content = ? WHERE _id = ? RETURNING _id`).get(title, currentLeft, currentRight, JSON.stringify(content), _id)
        conn.close()

        return res.status(200).json({ status: "success", data: notebook, message: "Notebook saved successfully." })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ status: "failed", message: "Internal server error." })
    }
}

async function getNotebook(req, res) {
    try {
        const valid = await checkAndUpdateSession(req.cookies.sessionId)
        if (!valid) return res.status(401).json({ status: "failed", message: "Session expired." })
        const _id = req.params._id
        /*const notebook = await getDB()
            .collection('notebooks')
            .findOne(
                { _id: new ObjectId(_id) },
                { returnDocument: "after" },
                { projection: { userId: 0 } }
            )*/ //MongoDB

        const conn = get_db()
        const notebook = conn.prepare(`SELECT _id, title, currentLeft, currentRight, content FROM notebooks WHERE _id = ?`).get(_id)
        conn.close()

        const content = JSON.parse(notebook.content)
        content.map((item, index) => {
            if (content[index].length > 0) content[index] = decryptContent(content[index])
        })
        notebook.content = content

        return res.status(200).json({ status: "success", data: notebook, message: "Notebook retrieved successfully." })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ status: "failed", message: "Internal server error." })
    }
}

async function deleteNotebook(req, res) {
    try {
        const valid = await checkAndUpdateSession(req.cookies.sessionId)
        if (!valid) return res.status(401).json({ status: "failed", message: "Session expired." })
        const _id = req.params._id
        /*const notebook = await getDB()
            .collection('notebooks')
            .deleteOne(
                { _id: new ObjectId(_id) },
            )*/ //MongoDB

        const conn = get_db()
        conn.prepare(`DELETE FROM notebooks WHERE _id = ?`).run(_id)
        conn.close()

        return res.status(200).json({ status: "success", message: "Notebook deleted successfully." })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ status: "failed", message: "Internal server error." })
    }
}

module.exports = { createNotebook, saveNotebook, getNotebook, deleteNotebook };
