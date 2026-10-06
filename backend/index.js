const express = require('express');
const { connectMongodb, getDB, closeDB } = require('./components/db');
const cors = require("cors");
const bcrypt = require('bcrypt');
const PORT = process.env.PORT;

const app = express();

app.use(cors({
    origin: "http://localhost:3100"
}));
app.use(express.json());

app.post('/users/login', async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await getDB()
            .collection('users')
            .findOne({ email: email })
        console.log(user)

        const match = verifyPassword(password, user.password)


        if (match) {
            return res.json({ status: "success", message: "Valid credentials." })
        }
        else res.json({ status: "fail", message: "Invalid credentials." })


    }
    catch (error) {
        console.log('error in query')
        res.status(500).json({ error: 'Internal server error' })
    }
});

app.post('/users/register', async (req, res) => {
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
})


async function hashPassword(plainPassword) {
    const saltRounds = 10;
    return await bcrypt.hash(plainPassword, saltRounds);
}

async function verifyPassword(plainPassword, storedHash) {
    const match = await bcrypt.compare(plainPassword, storedHash);
    return match;
}


async function startServer() {
    try {
        await connectMongodb();
        app.listen(PORT, () => {
            console.log(`Express listening on local: http://localhost:${PORT}/`)
        });
    }
    catch (error) {
        console.log("Failed to start server")
        await closeDB().catch(() => { });
        process.exit(1)
    }
}

startServer();