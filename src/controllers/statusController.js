import db from "../db/database.js";

export function getAll(_req, res) {
    const status = db.prepare(`
        SELECT
            s.id,
            s.id_status,
            MAX(CASE WHEN sn.language_code = 'fr' THEN sn.name END) AS french_name,
            MAX(CASE WHEN sn.language_code = 'en' THEN sn.name END) AS english_name,
            MAX(CASE WHEN sn.language_code = 'mg' THEN sn.name END) AS malagasy_name,
            s.color
        FROM status s
        LEFT JOIN status_name sn ON sn.id_status = s.id_status
        GROUP BY s.id, s.id_status, s.color
        ORDER BY s.id_status
    `).all();

    res.json(status);
}



export function getByIdStatus(req, res) {
    const row = db.prepare("SELECT * FROM status WHERE id_status = ?").get(req.params.id_status);
    if (!row) return res.status(404).json({ error: `status"${req.params.id_status}" introuvable` });
    res.json(row);
}

export function create(req, res) {
    const { id_status, english_name, french_name, malagasy_name, color } = req.body ?? {};

    if (!id_status || !english_name || !french_name || !color) {
        return res.status(400).json({ error: "Les champs id_status, english_name, french_name, color sont obligatoires" });
    }

    try {
        const insertStatus = db.prepare("INSERT INTO status(id_status, color) VALUES (?, ?)");
        const insertName   = db.prepare("INSERT INTO status_name(id_status, language_code, name) VALUES (?, ?, ?)");

        const createStatus = db.transaction(() => {
            const result = insertStatus.run(id_status, color);
            insertName.run(id_status, "fr", french_name);
            insertName.run(id_status, "en", english_name);
            insertName.run(id_status, "mg", malagasy_name ?? null);
            return result.lastInsertRowid;
        });

        const id = createStatus();
        res.status(201).json({ id, id_status, english_name, french_name, malagasy_name, color });
    } catch (err) {
        if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
            return res.status(409).json({ error: `Une status avec l'id_status "${id_status}" existe déjà` });
        }
        throw err;
    }
}

export function update(req, res) {
    const { english_name, french_name, malagasy_name, color } = req.body ?? {};
    const { id_status } = req.params;

    if (!english_name || !french_name || !color) {
        return res.status(400).json({ error: "Les champs english_name, french_name, color sont obligatoires" });
    }

    const updateColor = db.prepare("UPDATE status SET color = ? WHERE id_status = ?");
    const updateName  = db.prepare("UPDATE status_name SET name = ? WHERE id_status = ? AND language_code = ?");

    const updateStatus = db.transaction(() => {
        const result = updateColor.run(String(color), id_status);
        updateName.run(String(french_name),  id_status, "fr");
        updateName.run(String(english_name),  id_status, "en");
        updateName.run(malagasy_name ?? null, id_status, "mg");
        return result.changes;
    });

    const changes = updateStatus();

    if (changes === 0) {
        return res.status(404).json({ error: `status "${id_status}" introuvable` });
    }

    res.json({ id: id_status });
}

export function remove(req, res) {
    const { id_status } = req.params;

    const deleteNames  = db.prepare("DELETE FROM status_name WHERE id_status = ?");
    const deleteStatus = db.prepare("DELETE FROM status WHERE id_status = ?");

    const removeStatus = db.transaction(() => {
        deleteNames.run(id_status);                
        return deleteStatus.run(id_status).changes; 
    });

    const changes = removeStatus();

    if (changes === 0) {
        return res.status(404).json({ error: `status "${id_status}" introuvable` });
    }

    res.status(204).send();
}
