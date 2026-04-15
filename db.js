const { Pool } = require('pg');
const fs = require('fs');
require('dotenv').config();

// Configuration du Pool pour PostgreSQL (Supabase)
const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // Utilise l'URL de connexion complète de Supabase
    ssl: {
        rejectUnauthorized: false // Obligatoire pour se connecter à Supabase en externe
    }
});

// Santé de la connexion
pool.connect()
    .then(client => {
        const logMsg = `✅ [${new Date().toLocaleString()}] Connexion PostgreSQL (Supabase) réussie !\n`;
        console.log(logMsg);
        fs.appendFileSync("debug_log.txt", logMsg);
        client.release();
    })
    .catch(err => {
        const errMsg = `❌ [${new Date().toLocaleString()}] ERREUR CRITIQUE SUPABASE : ${err.message}\n`;
        console.error(errMsg);
        fs.appendFileSync("debug_log.txt", errMsg);
    });

module.exports = {
    query: (text, params) => pool.query(text, params),
};