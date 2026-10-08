const { getDB } = require('./db');
const { checkAndUpdateSession } = require('./account')

async function createNote(req, res) {
    try {
        const valid = await checkAndUpdateSession(req.cookies.sessionId)
        if (!valid) res.status(401).json({ status: "failed", message: "Session expired." })
        await getDB()
            .collection('notes')
            .insertOne({ content: "" })
        res.status(200).json({ status: "success", message: "Note created successfully." })
    }
    catch (error) {
        res.status(500).json({ status: "failed", message: "Internal server error." })
    }
}

module.exports = { createNote };
