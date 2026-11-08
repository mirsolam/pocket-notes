const { getDB } = require('./db');
const { checkAndUpdateSession } = require('./account');
const { decryptContent } = require('./note');
const { get_db } = require('../sqlite-database');

async function getDashboardList(req, res) {
    try {
        const valid = await checkAndUpdateSession(req.cookies.sessionId)
        if (!valid) return res.status(401).json({ status: "failed", message: "Session expired." })
        /*const notes = await getDB()
            .collection('notes')
            .find({ userId: req.cookies.userId }, { projection: { userId: 0 } })
            .toArray()
        notes.map(item => {
            if (item.content) item.content = decryptContent(item.content)
        })
        const notebooks = await getDB()
            .collection('notebooks')
            .find({ userId: req.cookies.userId }, { projection: { userId: 0, content: 0 } })
            .toArray()*/ //MongoDB

        const conn = get_db()
        const notes = conn.prepare(`SELECT _id, content FROM notes WHERE userId = ?`).all(req.cookies.userId)
        const notebooks = conn.prepare(`SELECT _id, title, currentLeft, currentRight FROM notebooks WHERE userId = ?`).all(req.cookies.userId)
        conn.close()

        notes.map(item => {
            if (item.content) item.content = decryptContent(item.content)
        })

        return res.status(200).json({ status: "success", data: { notes: notes, notebooks: notebooks }, message: "Dashboard retrieved successfully." })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ status: "failed", message: "Internal server error." })
    }
}

module.exports = { getDashboardList };
