const { MongoClient } = require('mongodb');

const {
    MONGODB_HOST,
    MONGODB_PORT,
    MONGODB_USER,
    MONGODB_PASSWORD,
    MONGODB_DATABASE,
    MONGODB_AUTH_SOURCE
} = process.env;

const uri =
    `mongodb://${encodeURIComponent(MONGODB_USER)}:` +
    `${encodeURIComponent(MONGODB_PASSWORD)}@` +
    `${MONGODB_HOST}:${MONGODB_PORT}/` +
    `?authSource=${encodeURIComponent(MONGODB_AUTH_SOURCE)}`;

const client = new MongoClient(uri)

let db
async function connectMongodb() {
    await client.connect()
    db = client.db(MONGODB_DATABASE)
    await db.command({ ping: 1 })
    console.log('Connected to DB')
    return db
}

function getDB() {
    if (!db)
        throw new Error('Database is not connceted.')
    return db
}

async function closeDB() {
    await client.close()
}
module.exports = { connectMongodb, getDB, closeDB };
