const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');
const fs = require('node:fs');
const { connect } = require("@tursodatabase/serverless");
const USE_PUBLIC_SQLITE = process.env.USE_PUBLIC_SQLITE
const TURSO_SQLITE_URL = process.env.TURSO_SQLITE_URL
const TURSO_SQLITE_TOKEN = process.env.TURSO_SQLITE_TOKEN

const conn = get_db()

async function configure_connection(conn) {
    if (USE_PUBLIC_SQLITE === "true") {
        // Enable foreign keys (off by default in SQLite)
        await conn.exec("PRAGMA foreign_keys=ON")
    }
    else {
        //WAL mode: better concurrency (concurrent reads during writes)
        conn.exec("PRAGMA journal_mode=WAL")

        // Synchronous NORMAL: good balance of safety and speed
        // Use FULL only if you need maximum durability guarantees
        conn.exec("PRAGMA synchronous=NORMAL")

        // Enable memory-mapped I/O for faster reads
        conn.exec("PRAGMA mmap_size=268435456")  // 256MB

        // Increase cache size (negative value = KB, positive = pages)
        conn.exec("PRAGMA cache_size=-64000")  // 64MB cache

        // Busy timeout: wait up to 5 seconds if the database is locked
        conn.exec("PRAGMA busy_timeout=5000")

        // Enable foreign keys (off by default in SQLite)
        conn.exec("PRAGMA foreign_keys=ON")
    }
}

function get_local_db() {
    const dbDirectory = path.join(__dirname, 'data');
    fs.mkdirSync(dbDirectory, { recursive: true });
    const newConn = new DatabaseSync(
        path.join(dbDirectory, 'app.db')
    );
    return newConn
}

function get_public_db() {
    if (!TURSO_SQLITE_URL || !TURSO_SQLITE_TOKEN) {
        throw new Error("Missing Turso database environment variables");
    }

    const newConn = connect({
        url: TURSO_SQLITE_URL,
        authToken: TURSO_SQLITE_TOKEN
    });

    return newConn
}

function get_db() {
    if (USE_PUBLIC_SQLITE === "true")
        return get_public_db()
    else
        return get_local_db()
}

async function init_db() {
    await configure_connection(conn)
    const usersTable = `
            CREATE TABLE IF NOT EXISTS users (
        _id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )
        `
    const sessionsTable = `
        CREATE TABLE IF NOT EXISTS sessions (
        _id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        expiresAt TEXT DEFAULT (datetime('now', '+7 days')),
        FOREIGN KEY (userId) REFERENCES users(_id)
    )
        `
    const index = `CREATE INDEX IF NOT EXISTS indx_sessions_expiresAt ON sessions(expiresAt DESC)`
    const notesTable = `
            CREATE TABLE IF NOT EXISTS notes (
        _id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        userId TEXT NOT NULL,
        content TEXT NOT NULL DEFAULT '',
        FOREIGN KEY (userId) REFERENCES users(_id)
    )
        `
    const notebooksTable = `
            CREATE TABLE IF NOT EXISTS notebooks (
        _id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        userId TEXT NOT NULL,
        title TEXT NOT NULL DEFAULT '',
        currentLeft INTEGER NOT NULL DEFAULT 0,
        currentRight INTEGER NOT NULL DEFAULT 1,
        content TEXT NOT NULL DEFAULT '['','']',
        FOREIGN KEY (userId) REFERENCES users(_id)
    )
        `

    if (USE_PUBLIC_SQLITE === "true") {
        await conn.exec(usersTable)

        await conn.exec(sessionsTable)

        await conn.exec(index)

        await conn.exec(notesTable)

        await conn.exec(notebooksTable)
    }
    else {
        conn.exec(usersTable)

        conn.exec(sessionsTable)

        conn.exec(index)

        conn.exec(notesTable)

        conn.exec(notebooksTable)
    }
}

async function buildSqliteStatement(statement, parameters, isGet, isAll) {
    if (parameters && typeof parameters !== 'object') throw new Error("Parameters are not of type Array.")

    const query = await conn.prepare(statement)
    try {
        if (USE_PUBLIC_SQLITE === "true") {
            if (parameters) {
                if (isGet)
                    return await query.get(parameters)
                else if (isAll)
                    return await query.all(parameters)
                else
                    return await query.run(parameters)
            }
            else {
                if (isGet)
                    return await query.get()
                else if (isAll)
                    return await query.all()
                else
                    return await query.run()
            }

        }
        else {
            if (parameters) {
                if (isGet)
                    return query.get(...parameters)
                else if (isAll)
                    return query.all(...parameters)
                else
                    return query.run(...parameters)
            }
            else {
                if (isGet)
                    return query.get()
                else if (isAll)
                    return query.all()
                else
                    return query.run()
            }
        }
    }
    catch (error) {
        console.log("error: ", error)
    }


}

module.exports = { init_db, get_db, conn, buildSqliteStatement }