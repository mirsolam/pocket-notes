const { getDB } = require('./db');
const { checkAndUpdateSession } = require('./account')

async function getDashboardList(req, res) {
    try {
        const valid = await checkAndUpdateSession(req.cookies.sessionId)
        if (!valid) res.status(401).json({ status: "failed", message: "Session expired." })
        const notes = await getDB()
            .collection('notes')
            .find({ userId: req.cookies.userId })
            .toArray()
        // const notebooks = await getDB()
        //     .collection('notebooks')
        //     .find({})
        //     .toArray()
        res.status(200).json({ status: "success", data: { notes: notes }, message: "Dashboard retrieved successfully." })
    }
    catch (error) {
        res.status(500).json({ status: "failed", message: "Internal server error." })
    }
}

module.exports = { getDashboardList };
