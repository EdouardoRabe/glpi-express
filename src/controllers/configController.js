import db from "../db/database.js";

// GET /config  → tous les enregistrements
export function getAll(_req, res) {
    const rows = db.prepare("SELECT * FROM config ORDER BY id").all();
    res.json(rows);
}

// GET /config/:name  → un enregistrement par name
export function getByName(req, res) {
    const row = db.prepare("SELECT * FROM config WHERE name = ?").get(req.params.name);
    if (!row) return res.status(404).json({ error: `Config "${req.params.name}" introuvable` });
    res.json(row);
}

// POST /config  { name, value }  → création
export function create(req, res) {
    const { name, value } = req.body ?? {};

    if (!name || value === undefined) {
        return res.status(400).json({ error: "Les champs 'name' et 'value' sont requis" });
    }

    try {
        const stmt = db.prepare("INSERT INTO config (name, value) VALUES (?, ?)");
        const result = stmt.run(name, String(value));
        res.status(201).json({ id: result.lastInsertRowid, name, value: String(value) });
    } catch (err) {
        if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
            return res.status(409).json({ error: `Une config avec le nom "${name}" existe déjà` });
        }
        throw err;
    }
}

// PUT /config/:name  { value }  → mise à jour complète
export function update(req, res) {
    const { value } = req.body ?? {};

    if (value === undefined) {
        return res.status(400).json({ error: "Le champ 'value' est requis" });
    }

    const result = db
        .prepare("UPDATE config SET value = ? WHERE name = ?")
        .run(String(value), req.params.name);

    if (result.changes === 0) {
        return res.status(404).json({ error: `Config "${req.params.name}" introuvable` });
    }

    res.json({ name: req.params.name, value: String(value) });
}

// DELETE /config/:name  → suppression
export function remove(req, res) {
    const result = db
        .prepare("DELETE FROM config WHERE name = ?")
        .run(req.params.name);

    if (result.changes === 0) {
        return res.status(404).json({ error: `Config "${req.params.name}" introuvable` });
    }

    res.status(204).send();
}
