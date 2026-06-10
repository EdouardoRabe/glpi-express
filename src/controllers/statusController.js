import db from "../db/database.js";

export function getAll(_req, res) {
    const rows = db.prepare("SELECT * FROM status ORDER BY id").all();
    res.json(rows);
}


export function getByIdStatus(req, res) {
    const row = db.prepare("SELECT * FROM statusWHERE id_status = ?").get(req.params.id_status);
    if (!row) return res.status(404).json({ error: `status"${req.params.id_status}" introuvable` });
    res.json(row);
}

export function create(req, res) {
    const { id_status, english_name, french_name, malagasy_name, color  } = req.body ?? {};

    if (!id_status || !english_name || !french_name || !malagasy_name || color) {
        return res.status(400).json({ error: "Les champs id_status, english_name, french_name, malagasy_name, color sont obligatoires" });
    }

    try {
        const stmt = db.prepare("INSERT INTO status(id_status, english_name, french_name, malagasy_name, color) VALUES (?, ?, ?, ?, ? )");
        const result = stmt.run(id_status, id_status, english_name, french_name, malagasy_name, color);
        res.status(201).json({ id: result.lastInsertRowid, id_status, english_name, french_name, malagasy_name, color });
    } catch (err) {
        if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
            return res.status(409).json({ error: `Une status avec l'id_status "${id_status}" existe déjà` });
        }
        throw err;
    }
}

export function update(req, res) {
    const {english_name, french_name, malagasy_name, color } = req.body ?? {};

    if ( !french_name ||  !color) {
        return res.status(400).json({ error: "Les champs id_status, english_name, french_name, malagasy_name, color sont obligatoires" });
    }

    const result = db
        .prepare("UPDATE status SET english_name = ?, french_name = ? , malagasy_name = ?, color =?  WHERE id_status = ?")
        .run(String(english_name), String(french_name), String(malagasy_name), String(color),req.params.id_status);

    if (result.changes === 0) {
        return res.status(404).json({ error: `status"${req.params.id_status}" introuvable` });
    }

    res.json({ id: req.params.id_status});
}

export function remove(req, res) {
    const result = db
        .prepare("DELETE FROM status WHERE id_status = ?")
        .run(req.params.id_status);

    if (result.changes === 0) {
        return res.status(404).json({ error: `status"${req.params.id_status}" introuvable` });
    }

    res.status(204).send();
}
