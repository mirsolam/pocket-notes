const { getDB } = require('./db');
const { checkAndUpdateSession } = require('./account')
const { ObjectId } = require('mongodb');
const crypto = require("crypto");
const { get_db } = require('../sqlite-database');


function encryptContent(content) {
    const CONTENT_ALGORITHM = process.env.CONTENT_ALGORITHM;
    const CONTENT_IV_LENGTH = parseInt(process.env.CONTENT_IV_LENGTH)
    const CONTENT_ENCRYPTION_KEY = Buffer.from(process.env.CONTENT_ENCRYPTION_KEY, "hex");

    const iv = crypto.randomBytes(CONTENT_IV_LENGTH);
    const cipher = crypto.createCipheriv(CONTENT_ALGORITHM, CONTENT_ENCRYPTION_KEY, iv);

    const encrypted = Buffer.concat([
        cipher.update(content, "utf8"),
        cipher.final(),
    ]);
    const authTag = cipher.getAuthTag();

    return Buffer.concat([iv, authTag, encrypted]).toString("base64");
}

function decryptContent(payload) {
    const CONTENT_ALGORITHM = process.env.CONTENT_ALGORITHM;
    const CONTENT_IV_LENGTH = parseInt(process.env.CONTENT_IV_LENGTH)
    const CONTENT_ENCRYPTION_KEY = Buffer.from(process.env.CONTENT_ENCRYPTION_KEY, "hex");

    const data = Buffer.from(payload, "base64");

    const iv = data.subarray(0, CONTENT_IV_LENGTH);
    const authTag = data.subarray(CONTENT_IV_LENGTH, CONTENT_IV_LENGTH + 16);
    const encrypted = data.subarray(CONTENT_IV_LENGTH + 16);

    const decipher = crypto.createDecipheriv(CONTENT_ALGORITHM, CONTENT_ENCRYPTION_KEY, iv);
    decipher.setAuthTag(authTag);

    return Buffer.concat([
        decipher.update(encrypted),
        decipher.final(),
    ]).toString("utf8");
}


async function createNote(req, res) {
    try {
        const valid = await checkAndUpdateSession(req.cookies.sessionId)
        if (!valid) return res.status(401).json({ status: "failed", message: "Session expired." })
        /*const note = await getDB()
            .collection('notes')
            .insertOne({ userId: req.cookies.userId, content: "" })*/ //MongoDB
        const conn = get_db()
        const note = conn.prepare(`INSERT INTO notes (userId) VALUES (?) RETURNING _id, content`).get(req.cookies.userId)
        conn.close()
        return res.status(200).json({ status: "success", data: note, message: "Note created successfully." })
    }
    catch (error) {
        console.log("Error: ", error)
        return res.status(500).json({ status: "failed", message: "Internal server error." })
    }
}

async function saveNote(req, res) {
    try {
        console.log("Here")
        const valid = await checkAndUpdateSession(req.cookies.sessionId)
        if (!valid) return res.status(401).json({ status: "failed", message: "Session expired." })
        const { _id, content } = req.body
        const encryptedContent = encryptContent(content)
        /*const note = await getDB()
            .collection('notes')
            .findOneAndUpdate(
                { _id: new ObjectId(_id) },
                { $set: { content: encryptedContent } },
                {
                    projection: { userId: 0 },
                    returnDocument: "after"
                }
            )*/ //MongoDB

        const conn = get_db()
        const note = conn.prepare(`UPDATE notes SET content = ? WHERE _id = ? RETURNING _id, content`).get(encryptedContent, _id)
        conn.close()
        note.content = decryptContent(note.content)

        return res.status(200).json({ status: "success", data: note, message: "Note saved successfully." })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ status: "failed", message: "Internal server error." })
    }
}

async function getNote(req, res) {
    try {
        const valid = await checkAndUpdateSession(req.cookies.sessionId)
        if (!valid) return res.status(401).json({ status: "failed", message: "Session expired." })
        const _id = req.params._id
        /*const note = await getDB()
            .collection('notes')
            .findOne(
                { _id: new ObjectId(_id) },
                { returnDocument: "after" },
                { projection: { userId: 0 } }
            )*/
        const conn = get_db()
        const note = conn.prepare(`SELECT _id, content FROM notes WHERE _id = ?`).get(_id)
        conn.close()
        if (note.content) note.content = decryptContent(note.content)
        return res.status(200).json({ status: "success", data: note, message: "Note retrieved successfully." })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ status: "failed", message: "Internal server error." })
    }
}

async function deleteNote(req, res) {
    try {
        const valid = await checkAndUpdateSession(req.cookies.sessionId)
        if (!valid) return res.status(401).json({ status: "failed", message: "Session expired." })
        const _id = req.params._id
        /*const note = await getDB()
            .collection('notes')
            .deleteOne(
                { _id: new ObjectId(_id) },
            )*/ //MongoDB
        const conn = get_db()
        conn.prepare(`DELETE FROM notes WHERE _id = ?`).run(_id)
        conn.close()

        return res.status(200).json({ status: "success", message: "Note deleted successfully." })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ status: "failed", message: "Internal server error." })
    }
}

module.exports = { createNote, saveNote, getNote, deleteNote, decryptContent, encryptContent };
