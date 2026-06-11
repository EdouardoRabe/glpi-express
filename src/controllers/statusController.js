import db from "../db/database.js";

export function getLanguages() {
    return db.prepare("SELECT code, name FROM language").all();
}

export function getApiLanguages(_req, res){
    const result = db.prepare("SELECT code, name FROM language").all();
    res.json(result);
}

export function langKey(lang) {
    return `${lang.name.toLowerCase()}_name`;
}


function safeIdent(value) {
    if (!/^[a-zA-Z_]\w*$/.test(value)) {
        throw new Error(`Identifiant de langue invalide : ${value}`);
    }
    return value;
}

export function getAll(_req, res) {
    const languages = getLanguages();

    const pivotColumns = languages.map((lang) => {
        const code = safeIdent(lang.code);
        const col  = safeIdent(langKey(lang));
        return `MAX(CASE WHEN sn.language_code = '${code}' THEN sn.name END) AS ${col}`;
    }).join(",\n  ");

    const status = db.prepare(`
        SELECT
            s.id,
            s.id_status,
            ${pivotColumns},
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
    const { id_status, color } = req.body ?? {};

    if (!id_status || !color) {
        return res.status(400).json({ error: "Les champs id_status et color sont obligatoires" });
    }

    try {
        const languages = getLanguages();
        const insertStatus = db.prepare("INSERT INTO status(id_status, color) VALUES (?, ?)");
        const insertName   = db.prepare("INSERT INTO status_name(id_status, language_code, name) VALUES (?, ?, ?)");

        const createStatus = db.transaction(() => {
            const result = insertStatus.run(id_status, color);
            for (const lang of languages) {
                const value = req.body[langKey(lang)];
                insertName.run(id_status, lang.code, value ?? null);
            }
            return result.lastInsertRowid;
        });

        const id = createStatus();
        res.status(201).json({ id, ...req.body });
    } catch (err) {
        if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
            return res.status(409).json({ error: `Une status avec l'id_status "${id_status}" existe déjà` });
        }
        throw err;
    }
}

export function update(req, res) {
    const { color } = req.body ?? {};
    const { id_status } = req.params;

    if (!color) {
        return res.status(400).json({ error: "Le champ color est obligatoire" });
    }

    const languages = getLanguages();
    const updateColor = db.prepare("UPDATE status SET color = ? WHERE id_status = ?");
    const updateName  = db.prepare("UPDATE status_name SET name = ? WHERE id_status = ? AND language_code = ?");
    const insertName  = db.prepare("INSERT INTO status_name(id_status, language_code, name) VALUES (?, ?, ?)");

    const updateStatus = db.transaction(() => {
        const result = updateColor.run(String(color), id_status);
        for (const lang of languages) {
            const value = req.body[langKey(lang)] ?? null;
            const changed = updateName.run(value, id_status, lang.code).changes;
            if (changed === 0) {
                insertName.run(id_status, lang.code, value);
            }
        }
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

export function createLanguage(req, res) {
    const { code, name } = req.body ?? {};

    if (!code || !name) {
        return res.status(400).json({ error: "Les champs code et name sont obligatoires" });
    }
    try {
        safeIdent(code);
        safeIdent(`${name.toLowerCase()}_name`);
    } catch {
        return res.status(400).json({ error: "code/name invalides (lettres, chiffres et _ uniquement)" });
    }

    try {
        const insertLanguage = db.prepare("INSERT INTO language(code, name) VALUES (?, ?)");
        const insertName     = db.prepare("INSERT INTO status_name(id_status, language_code, name) VALUES (?, ?, ?)");
        const allStatus      = db.prepare("SELECT id_status FROM status");

        const createLang = db.transaction(() => {
            const result = insertLanguage.run(code, name);
            for (const s of allStatus.all()) {
                insertName.run(s.id_status, code, "");
            }
            return result.lastInsertRowid;
        });

        const id = createLang();
        res.status(201).json({ id, code, name });
    } catch (err) {
        if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
            return res.status(409).json({ error: `La langue "${code}" existe déjà` });
        }
        throw err;
    }
}
