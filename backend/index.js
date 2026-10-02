const express = require('express');
const { connectMongodb, getDB, closeDB } = require('./db');
const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello pocket notes.')
});

app.get('/users', async (req, res) => {
    try {
        const users = await getDB()
            .collection('users')
            .find({})
            .toArray();

        res.json(users)
    }
    catch (error) {
        console.log('error in query')
        res.status(500).json({ error: 'Internal server error' })
    }
});

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