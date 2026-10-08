const bcrypt = require('bcrypt');
const { getDB } = require('./db');
const crypto = require("crypto");

async function hashPassword(plainPassword) {
    const saltRounds = 10;
    return await bcrypt.hash(plainPassword, saltRounds);
}

async function verifyPassword(plainPassword, storedHash) {
    const match = await bcrypt.compare(plainPassword, storedHash);
    return match;
}

async function checkAndUpdateSession(sessionId) {
    try {
        const session = await getDB()
            .collection('sessions')
            .findOne({ _id: sessionId })

        if (!session) return false

        await getDB()
            .collection('sessions')
            .updateOne(
                { _id: sessionId },
                { $set: { expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } }
            )

        return true
    }
    catch (error) {
        return false
    }

}

async function regitserAccount(req, res) {
    try {
        const { name, email, password } = req.body
        let hashedPassword = ""
        await hashPassword(password)
            .then(data => {
                hashedPassword = data
            })

        if (hashedPassword !== "") {
            const users = await getDB()
                .collection('users')
                .insertOne({ name: name, email: email, password: hashedPassword })
            return res.status(200).json({ status: "success", message: "Registartion successful!" })
        }

    }
    catch (error) {
        console.log('error in query: ', error)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body
        const sessionId = crypto.randomBytes(32).toString("hex");

        const user = await getDB()
            .collection('users')
            .findOne({ email: email })

        if (!user) return res.status(401).json({ status: "fail", error: "Invalid credentials" });

        const match = verifyPassword(password, user.password)

        await getDB()
            .collection("sessions")
            .insertOne({
                _id: sessionId,
                userId: user._id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            });

        if (match) {
            res.cookie("sessionId", sessionId, {
                httpOnly: true,
                secure: true,
                sameSite: "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000
            });
            res.json({ status: "success", message: "Valid credentials." })
        }
        else res.status(401).json({ status: "fail", message: "Invalid credentials." })
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' })
    }
}

async function checkSessionValidity(req, res) {
    try {
        const valid = await checkAndUpdateSession(req.cookies.sessionId)

        if (!valid) return res.status(401).json({ status: "failed", message: "Session expired." })

        return res.json({ status: "success", message: "Session is valid." })
    }
    catch (error) {
        return res.status(500).json({ status: "failed", message: "Internal error." })
    }
}

module.exports = { regitserAccount, login, checkSessionValidity, checkAndUpdateSession };
