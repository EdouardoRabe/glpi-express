import "dotenv/config";
import express from "express";
import corsMiddleware from "./middlewares/cors.js";
import configRoutes from "./routes/config.js";

const app  = express();
const PORT = process.env.PORT || 3000;

// --- Middlewares globaux ---
app.use(corsMiddleware);
app.use(express.json());

// --- Routes ---
app.use("/config", configRoutes);

// --- Health check ---
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// --- Gestion des erreurs globale ---
app.use((err, _req, res, _next) => {
    console.error(err);
    const status = err.status ?? 500;
    res.status(status).json({ error: err.message || "Erreur interne" });
});

app.listen(PORT, () => {
    console.log(`glpi-express démarré sur http://localhost:${PORT}`);
});
