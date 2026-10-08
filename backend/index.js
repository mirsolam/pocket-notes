const express = require('express');
const { connectMongodb, closeDB } = require('./components/db');
const { regitserAccount, login, checkSessionValidity } = require('./components/account')
const { createNote } = require('./components/note')
const cors = require("cors");
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT;


const app = express();
app.use(cors({
    origin: "http://localhost:3100",
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());

app.post('/users/login', login);

app.post('/users/register', regitserAccount)

app.get('/users/checksession', checkSessionValidity)

app.post('/notes/create', createNote)

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