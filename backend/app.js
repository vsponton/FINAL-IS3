const express = require('express');
const cors = require('cors');
const routes = require('./routes'); // si tenés router, si no, dejá tus endpoints acá

// Lista de orígenes permitidos por CORS.
// Siempre incluye localhost:5173 (desarrollo).
// Agregar URLs de Render (QA y PROD) vía FRONTEND_URL, separadas por coma.
// Ejemplo: FRONTEND_URL=https://app-qa.onrender.com,https://app.onrender.com
const ALLOWED_ORIGINS = new Set(
  [
    "http://localhost:5173",
    ...(process.env.FRONTEND_URL
      ? process.env.FRONTEND_URL.split(",").map((u) => u.trim())
      : []),
  ].filter(Boolean)
);

const corsOptions = {
  origin: (origin, callback) => {
    // Permite requests sin Origin (tests con supertest, curl, health checks).
    if (!origin || ALLOWED_ORIGINS.has(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS: origen no permitido"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
};

const app = express();
// Ocultar cabecera X-Powered-By que expone la versión de Express.
app.disable("x-powered-by");
app.use(cors(corsOptions));
app.use(express.json());

app.get('/health', (_req, res) => res.sendStatus(200));

// ejemplo: app.get('/api/health', (req,res)=>res.json({ok:true}));
/* monta aquí todas tus rutas /api/books, /api/loans, /api/sales */

module.exports = app;
