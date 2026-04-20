const { Pool } = require('pg');
const fs = require('fs');
require('dotenv').config();

// Configuration du Pool pour PostgreSQL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

// Santé de la connexion
pool.connect()
    .then((client) => {
        const logMsg = `✅ [${new Date().toLocaleString()}] Connexion PostgreSQL (Supabase) réussie !\n`;
        console.log(logMsg);
        fs.appendFileSync('debug_log.txt', logMsg);
        client.release();
    })
    .catch((err) => {
        const errMsg = `❌ [${new Date().toLocaleString()}] ERREUR CRITIQUE SUPABASE : ${err.message}\n`;
        console.error(errMsg);
        fs.appendFileSync('debug_log.txt', errMsg);
    });

// On exporte le pool directement pour permettre db.query ET db.connect (pour les transactions)
module.exports = pool;