import cors from "cors";

const rawOrigins = process.env.ALLOWED_ORIGINS || "";

// Parse la liste d'origines depuis .env  ("http://localhost:5173,https://monapp.com")
const allowedOrigins = rawOrigins
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

const corsOptions = {
    origin: (origin, callback) => {
        // Autorise les appels sans Origin (ex: curl, Postman, proxy Vite côté serveur)
        if (!origin) return callback(null, true);

        if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        callback(new Error(`CORS: origine non autorisée → ${origin}`));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};

export default cors(corsOptions);
