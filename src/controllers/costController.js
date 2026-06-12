import db from "../db/database.js";

export function getAll(_req, res) {
    const rows = db.prepare("SELECT id_ticket,  SUM(cost) AS cost, SUM(ouverture_cost) AS ouverture_cost FROM cost_ticket GROUP BY id_ticket ORDER BY id").all();
    res.json(rows);
}

export function create(req, res) {
    const { id_ticket, cost } = req.body ?? {};

    if (!id_ticket) {
        return res.status(400).json({ error: "Le champ id_ticket est obligatoire" });
    }

    try {
        const stmt = db.prepare("INSERT INTO cost_ticket (id_ticket, cost) VALUES (?, ?)");
        const result = stmt.run(id_ticket, cost);
        res.status(201).json({ id: result.lastInsertRowid, id_ticket });
    } catch (err) {
        if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
            return res.status(409).json({ error: `Une cost_ticket avec l'id_ticket "${id_ticket}" existe déjà` });
        }
        throw err;
    }
}

export function remove(req, res){
    const { id_ticket } = req.params;

    if (!id_ticket) {
        return res.status(400).json({ error: "Le champ id_ticket est obligatoire" });
    }

    const last = db.prepare("SELECT * FROM cost_ticket WHERE id_ticket = ? ORDER BY id DESC LIMIT 1").get(id_ticket);

    if (!last) {
        return res.status(404).json({ error: `Aucun cout trouvé pour le ticket "${id_ticket}"` });
    }

    db.prepare("DELETE FROM cost_ticket WHERE id = ?").run(last.id);

    res.json({ deleted: last });
}

export function reouvrir(req, res){
    const { id_ticket } = req.params;

    if (!id_ticket) {
        return res.status(400).json({ error: "Le champ id_ticket est obligatoire" });
    }

    const last = db.prepare("SELECT * FROM cost_ticket WHERE id_ticket = ? ORDER BY id DESC LIMIT 1").get(id_ticket);

    if (!last) {
        return res.status(404).json({ error: `Aucun cout trouvé pour le ticket "${id_ticket}"` });
    }

    const ouverture = last.cost * 0.10;

    const stmt = db.prepare("INSERT INTO cost_ticket (id_ticket, cost, ouverture_cost) VALUES (?, ?, ?)");
    const result = stmt.run(id_ticket, 0, ouverture);
D
    res.status(201).json({ id: result.lastInsertRowid, id_ticket, ouverture_cost: ouverture });
}

// export function update(req, res) {
//     const {id_ticket } = req.body ?? {};

//     if (id_ticket === undefined) {
//         return res.status(400).json({ error: "Le champ 'value' est requis" });
//     }

//     const result = db
//         .prepare("UPDATE cost_ticket SET id_ticket = ? WHERE id = ?")
//         .run(id_ticket, req.params.id);

//     if (result.changes === 0) {
//         return res.status(404).json({ error: `cost_ticket "${req.params.id}" introuvable` });
//     }

//     res.json({ id: req.params.id, id_ticket });
// }

// export function remove(req, res) {
//     const result = db
//         .prepare("DELETE FROM cost_ticket WHERE id_ticket = ?")
//         .run(req.params.id_ticket);

//     if (result.changes === 0) {
//         return res.status(404).json({ error: `cost_ticket "${req.params.id_ticket}" introuvable` });
//     }

//     res.status(204).send();
// }
