import db from "../db/database.js";

export function getAll(_req, res) {
    const rows = db.prepare("SELECT * FROM corbeille ORDER BY id").all();
    res.json(rows);
}


export function create(req, res) {
    const { code, value } = req.body ?? {};

    if (!code) {
        return res.status(400).json({ error: "Le champ code est obligatoire" });
    }

    try {
        const stmt = db.prepare("INSERT INTO status_config (code, value) VALUES (?, ?)");
        const result = stmt.run(code, value);
        res.status(201).json({ id: result.lastInsertRowid, code, value });
    } catch (err) {
        if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
            return res.status(409).json({ error: `Une statusConfig avec le code  "${idticket}" existe déjà` });
        }
        throw err;
    }
}

export function update(req, res) {
    const { value } = req.body ?? {};

    if (value === undefined) {
        return res.status(400).json({ error: "Le champ 'value' est requis" });
    }

    const result = db
        .prepare("UPDATE status_config SET value = ? WHERE code = ?")
        .run(value, req.params.code);

    if (result.changes === 0) {
        return res.status(404).json({ error: `statusConfig "${req.params.code}" introuvable` });
    }

    res.json({ code: req.params.code, value });
}
