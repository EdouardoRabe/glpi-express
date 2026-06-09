import db from "../db/database.js";

export function getAll(_req, res) {
    const rows = db.prepare("SELECT * FROM corbeille ORDER BY id").all();
    res.json(rows);
}

export function getByIdTicket(req, res) {
    const row = db.prepare("SELECT * FROM corbeille WHERE idticket = ?").get(req.params.idticket);
    if (!row) return res.status(404).json({ error: `corbeille "${req.params.idticket}" introuvable` });
    res.json(row);
}

export function create(req, res) {
    const { idticket } = req.body ?? {};

    if (!idticket) {
        return res.status(400).json({ error: "Le champ idticket est obligatoire" });
    }

    try {
        const stmt = db.prepare("INSERT INTO corbeille (idticket) VALUES (?)");
        const result = stmt.run(idticket);
        res.status(201).json({ id: result.lastInsertRowid, idticket });
    } catch (err) {
        if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
            return res.status(409).json({ error: `Une corbeille avec l'idticket "${idticket}" existe déjà` });
        }
        throw err;
    }
}

export function update(req, res) {
    const {idticket } = req.body ?? {};

    if (idticket === undefined) {
        return res.status(400).json({ error: "Le champ 'value' est requis" });
    }

    const result = db
        .prepare("UPDATE corbeille SET idticket = ? WHERE id = ?")
        .run(idticket, req.params.id);

    if (result.changes === 0) {
        return res.status(404).json({ error: `corbeille "${req.params.id}" introuvable` });
    }

    res.json({ id: req.params.id, idticket });
}

export function remove(req, res) {
    const result = db
        .prepare("DELETE FROM corbeille WHERE idticket = ?")
        .run(req.params.idticket);

    if (result.changes === 0) {
        return res.status(404).json({ error: `corbeille "${req.params.idticket}" introuvable` });
    }

    res.status(204).send();
}
