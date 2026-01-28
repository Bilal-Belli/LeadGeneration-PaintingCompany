const Database = require("better-sqlite3");
const bcrypt = require("bcrypt");

const dbPath = process.env.DB_PATH || "./leads.db";
const db = new Database(dbPath);

// Create tables
db.prepare(`
    CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    message TEXT,
    status TEXT DEFAULT 'new',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`).run();

db.prepare(`
    CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT
    )
`).run();

// Auto-create admin if not exists
if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    const exists = db
        .prepare("SELECT id FROM admins WHERE email=?")
        .get(process.env.ADMIN_EMAIL);

    if (!exists) {
        const hash = bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10);

        db.prepare(`
        INSERT INTO admins (email,password)
        VALUES (?,?)
        `).run(process.env.ADMIN_EMAIL, hash);

        console.log("✅ Admin auto-created");
    }
}

module.exports = db;