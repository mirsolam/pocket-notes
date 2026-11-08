const bcrypt = require('bcrypt');
const { getDB } = require('./db');
const crypto = require("crypto");
const { get_db } = require('../sqlite-database');

const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
}

function setCookies(res, sessionId, userId) {
    res.cookie("sessionId", sessionId, cookieOptions);
    res.cookie("userId", userId, cookieOptions);
}

function removeCookies(res) {
    res.clearCookie("sessionId", cookieOptions);
    res.clearCookie("userId", cookieOptions);
}

async function hashPassword(plainPassword) {
    const saltRounds = 10;
    return await bcrypt.hash(plainPassword, saltRounds);
}

async function verifyPassword(plainPassword, storedHash) {
    const match = await bcrypt.compare(plainPassword, storedHash);
    return match;
}

async function findUser(email) {
    /*const user = await getDB()
        .collection('users')
        .findOne({ email: email })*/ //MongoDB

    const conn = get_db()
    const user = conn.prepare(`SELECT * FROM users WHERE email = ?`).get(email)
    conn.close()

    return user

}

async function checkAndUpdateSession(sessionId) {
    try {
        /*const session = await getDB()
            .collection('sessions')
            .findOne({ _id: sessionId })

        if (!session) return false

        await getDB()
            .collection('sessions')
            .updateOne(
                { _id: sessionId },
                { $set: { expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } }
            )

        return true*/ //MongoDB

        const conn = get_db()
        const allSessions = conn.prepare(`SELECT _id, expiresAt FROM sessions`).all()

        let currentSession = null;
        let expiredSessions = [];
        let placeholder = ""
        allSessions.map(item => {
            if (new Date(item.expiresAt).toISOString() < new Date(Date.now()).toISOString()) {
                expiredSessions.push(item._id)
                placeholder += "?, "
            }
            if (item._id === sessionId) currentSession = item
        })

        placeholder = placeholder.slice(0, placeholder.length - 2)

        if (expiredSessions.length > 0)
            conn.prepare(`DELETE FROM sessions where _id IN (${placeholder})`).run(...expiredSessions)

        if (!currentSession || new Date(currentSession.expiresAt).toISOString() < new Date(Date.now()).toISOString()) {
            conn.close()
            return false
        }

        conn.prepare(`UPDATE sessions SET expiresAt = ? WHERE _id = ?`).run(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), sessionId)
        conn.close()

        return true

    }
    catch (error) {
        console.log("Error: ", error)
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
            /*const users = await getDB()
                .collection('users')
                .insertOne({ name: name, email: email, password: hashedPassword })
            return res.json({ status: "success", message: "Registartion successful!" })*/ //MongoDB

            const conn = get_db()
            conn.prepare(`INSERT INTO users (name, email, password) VALUES (?,?,?)`).run(name, email, hashedPassword)
            conn.close()

            return res.json({ status: "success", message: "Registartion successful!" })
        }

        return res.status(400).json({ status: "fail", message: "Registartion failed!" })
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
        const user = await findUser(email)

        if (!user) return res.status(401).json({ status: "fail", error: "Invalid credentials" });

        const match = await verifyPassword(password, user.password)

        /*await getDB()
            .collection("sessions")
            .insertOne({
                _id: sessionId,
                userId: user._id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            });*/ //MongoDB

        if (match) {
            const conn = get_db()
            conn.prepare(`INSERT INTO sessions (_id, userId) VALUES(?,?)`).run(sessionId, user._id)
            conn.close()

            setCookies(res, sessionId, user._id)

            res.json({ status: "success", message: "Valid credentials." })
        }
        else res.status(401).json({ status: "fail", message: "Invalid credentials." })
    }
    catch (error) {
        console.error("Login: ", error)
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

async function logout(req, res) {
    try {
        /*await getDB()
            .collection('sessions')
            .deleteOne({ _id: req.cookies.sessionId })*/ //MongoDB

        const conn = get_db()
        conn.prepare(`DELETE FROM sessions WHERE _id = ?`).run(req.cookies.sessionId)
        conn.close()

        removeCookies(res)
        return res.json({ status: "success", message: "Logout successfully." })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ status: "failed", message: "Internal error." })
    }
}

async function isEmailValid(req, res) {
    try {
        const email = req.params.email

        if (!await findUser(email)) return res.status(401).json({ status: "fail", error: "Invalid email." });
        return res.json({ status: "success", message: "Valid email." });
    }
    catch (error) {
        console.error("Login: ", error)
        res.status(500).json({ error: 'Internal server error.' })
    }
}

async function forgotPassword(req, res) {
    try {
        const { email, password } = req.body

        let hashedPassword = ""
        await hashPassword(password)
            .then(data => {
                hashedPassword = data
            })

        if (hashedPassword !== "") {
            /*const users = await getDB()
                .collection('users')
                .findOneAndUpdate(
                    { email: email },
                    { $set: { password: hashedPassword } },
                    {
                        projection: { userId: 0 },
                        returnDocument: "after"
                    }
                )*/ //MongoDB

            const conn = get_db()
            conn.prepare(`UPDATE users SET password = ? WHERE email = ?`).run(hashedPassword, email)
            conn.close()

            return res.status(200).json({ status: "success", message: "Password change successful!" })
        }

        return res.status(200).json({ status: "fail", message: "Password change failed!" })
    }
    catch (error) {
        console.error("Login: ", error)
        res.status(500).json({ error: 'Internal server error.' })
    }
}

module.exports = { regitserAccount, login, checkSessionValidity, checkAndUpdateSession, logout, isEmailValid, forgotPassword };
