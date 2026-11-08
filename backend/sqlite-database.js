const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');
const fs = require('node:fs');

const dbDirectory = path.join(__dirname, 'data');
fs.mkdirSync(dbDirectory, { recursive: true });

function configure_connection(conn) {
    //WAL mode: better concurrency (concurrent reads during writes)
    conn.exec("PRAGMA journal_mode=WAL")

    // Synchronous NORMAL: good balance of safety and speed
    // Use FULL only if you need maximum durability guarantees
    conn.exec("PRAGMA synchronous=NORMAL")

    // Increase cache size (negative value = KB, positive = pages)
    conn.exec("PRAGMA cache_size=-64000")  // 64MB cache

    // Enable memory-mapped I/O for faster reads
    conn.exec("PRAGMA mmap_size=268435456")  // 256MB

    // Busy timeout: wait up to 5 seconds if the database is locked
    conn.exec("PRAGMA busy_timeout=5000")

    // Enable foreign keys (off by default in SQLite)
    conn.exec("PRAGMA foreign_keys=ON")
}

function get_db() {
    const conn = new DatabaseSync(
        path.join(dbDirectory, 'app.db')
    );
    return conn
}

function init_db() {
    const conn = get_db()
    configure_connection(conn)
    conn.exec(`
            CREATE TABLE IF NOT EXISTS users (
        _id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )
        `)

    conn.exec(`
        CREATE TABLE IF NOT EXISTS sessions (
        _id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        expiresAt TEXT DEFAULT (datetime('now', '+7 days')),
        FOREIGN KEY (userId) REFERENCES users(_id)
    )
        `)

    conn.exec(`CREATE INDEX IF NOT EXISTS indx_sessions_expiresAt ON sessions(expiresAt DESC)`)

    conn.exec(`
            CREATE TABLE IF NOT EXISTS notes (
        _id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        userId TEXT NOT NULL,
        content TEXT NOT NULL DEFAULT '',
        FOREIGN KEY (userId) REFERENCES users(_id)
    )
        `)

    conn.exec(`
            CREATE TABLE IF NOT EXISTS notebooks (
        _id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        userId TEXT NOT NULL,
        title TEXT NOT NULL DEFAULT '',
        currentLeft INTEGER NOT NULL DEFAULT 0,
        currentRight INTEGER NOT NULL DEFAULT 1,
        content TEXT NOT NULL DEFAULT '['','']',
        FOREIGN KEY (userId) REFERENCES users(_id)
    )
        `)
    conn.close()
}

module.exports = { init_db, get_db }