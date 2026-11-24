const express = require('express');
const { regitserAccount, login, checkSessionValidity, logout, isEmailValid, forgotPassword } = require('./components/account')
const { createNote, saveNote, getNote, deleteNote } = require('./components/note')
const { createNotebook, getNotebook, saveNotebook, deleteNotebook } = require('./components/notebook')
const { getDashboardList } = require('./components/dashboard')
// const cors = require("cors");
const cookieParser = require('cookie-parser');
const { init_db, conn } = require('./sqlite-database');
const PORT = process.env.API_PORT;
const VITE_APP_API_URL = process.env.VITE_APP_API_URL
const USE_PUBLIC_SQLITE = process.env.USE_PUBLIC_SQLITE
// const REACT_LOCALNETWORK_URL = process.env.REACT_LOCALNETWORK_URL
// const REACT_LOCALNETWORK_DOMAIN_URL = process.env.REACT_LOCALNETWORK_DOMAIN_URL
// const REACT_LOCALHOST_URL = process.env.REACT_LOCALHOST_URL
// const REACT_TAILSCALE_SHORT_DOMAIN = process.env.REACT_TAILSCALE_SHORT_DOMAIN
// const REACT_TAILSCALE_FULL_DOMAIN = process.env.REACT_TAILSCALE_FULL_DOMAIN
// const REACT_TAILSCALE_IP = process.env.REACT_TAILSCALE_IP

const app = express()
// app.use(cors({
//     origin: [
//         REACT_LOCALNETWORK_URL,
//         REACT_LOCALHOST_URL,
//         REACT_LOCALNETWORK_DOMAIN_URL,
//         REACT_TAILSCALE_IP,
//         REACT_TAILSCALE_SHORT_DOMAIN,
//         REACT_TAILSCALE_FULL_DOMAIN,
//     ],
//     credentials: true
// }))
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
        await init_db()
        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Express listening on local: ${VITE_APP_API_URL}. Public SQLite: ${USE_PUBLIC_SQLITE}`)
        });
    }
    catch (error) {
        console.log("Failed to start server ", error)
        if (USE_PUBLIC_SQLITE !== "true")
            conn.close()
        process.exit(1)
    }
}

async function closeServer() {
    console.log('Shutting down server...');
    if (USE_PUBLIC_SQLITE !== "true")
        conn.close()
    console.log('SQLite connection closed');
    process.exit(0);

}

startServer();

process.on('SIGINT', closeServer);
process.on('SIGTERM', closeServer);
