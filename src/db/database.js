import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DB_PATH = process.env.DB_PATH || "./data/glpi.db";

// Crée le dossier data/ si inexistant
const dir = path.dirname(DB_PATH);
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

const db = new Database(DB_PATH);

// Performances recommandées pour SQLite
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// --- Migrations / création des tables ---
db.exec(`
    CREATE TABLE IF NOT EXISTS corbeille (
        id  INTEGER PRIMARY KEY AUTOINCREMENT,
        idticket INTEGER NOT NULL
    );
`);
export default db;
