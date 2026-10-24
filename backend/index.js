const express = require('express');
const { connectMongodb, closeDB } = require('./components/db');
const { regitserAccount, login, checkSessionValidity, logout, isEmailValid, forgotPassword } = require('./components/account')
const { createNote, saveNote, getNote, deleteNote } = require('./components/note')
const { createNotebook, getNotebook, saveNotebook, deleteNotebook } = require('./components/notebook')
const { getDashboardList } = require('./components/dashboard')

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

/*--Users--*/
app.post('/users/login', login);

app.post('/users/register', regitserAccount)

app.get('/users/checksession', checkSessionValidity)

app.get('/users/logout', logout)

app.get('/users/isemailvalid/:email', isEmailValid)

app.post('/users/forgotpassword', forgotPassword)

/*--Notes--*/
app.post('/notes/create', createNote)

app.post('/notes/save', saveNote)

app.get('/notes/:_id', getNote)

app.delete('/notes/:_id', deleteNote)

/*--Notebooks--*/
app.post('/notebooks/create', createNotebook)

app.post('/notebooks/save', saveNotebook)

app.get('/notebooks/:_id', getNotebook)

app.delete('/notebooks/:_id', deleteNotebook)

/*--Dashboard--*/
app.get('/dashboard/', getDashboardList)


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