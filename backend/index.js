const express = require('express');
const { regitserAccount, login, checkSessionValidity, logout, isEmailValid, forgotPassword } = require('./components/account')
const { createNote, saveNote, getNote, deleteNote } = require('./components/note')
const { createNotebook, getNotebook, saveNotebook, deleteNotebook } = require('./components/notebook')
const { getDashboardList } = require('./components/dashboard')
const cors = require("cors");
const cookieParser = require('cookie-parser');
const { init_db } = require('./sqlite-database');
const PORT = process.env.API_PORT;
const REACT = process.env.REACT_URL

const app = express()
let conn = null
app.use(cors({
    origin: REACT,
    credentials: true
}))
app.use(cookieParser())
app.use(express.json())

/*--Users--*/
app.post('/users/login', login)

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
        conn = init_db()
        app.listen(PORT, () => {
            console.log(`Express listening on local: http://localhost:${PORT}/`)
        });
    }
    catch (error) {
        console.log("Failed to start server")
        if (conn) conn.close()
        process.exit(1)
    }
}

function closeServer() {
    console.log('Shutting down server...');
    if (conn) conn.close()
    console.log('SQLite connection closed');
    process.exit(0);

}

startServer();

process.on('SIGINT', closeServer);
process.on('SIGTERM', closeServer);