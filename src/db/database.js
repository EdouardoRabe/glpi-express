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

    CREATE TABLE IF NOT EXISTS status(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_status INTEGER UNIQUE NOT NULL,
        color TEXT
    );

    CREATE TABLE IF NOT EXISTS language(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS status_name(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_status INTEGER NOT NULL,
        language_code TEXT NOT NULL,
        name TEXT NOT NULL
    );


    INSERT OR IGNORE INTO  status (id_status, color)
    VALUES
        (1, '#63a6e4'),
        (2, '#f9e75b'),
        (6, '#06a629')
    ;

    INSERT OR IGNORE INTO language (code, name)
    VALUES
        ('en', 'English'),
        ('fr', 'French'),
        ('mg', 'Malagasy')
    ;

    INSERT OR IGNORE INTO status_name (id_status, language_code, name)
    VALUES
        (1, 'en', 'New'),
        (1, 'fr', 'Nouveau'),
        (1, 'mg', 'Vaovao'),
        (2, 'en', 'In progress'),
        (2, 'fr', 'In progress'),
        (2, 'mg', 'Efa manao'),
        (6, 'en', 'Closed'),
        (6, 'fr', 'Terminé'),
        (6, 'mg', 'Vita')
     ;

`);
export default db;
