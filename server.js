const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser'); // 
require('dotenv').config();

const app = express();
// Correction : Définir la variable port (exigence technique du CDC)
const port = process.env.PORT || 3000;

// Import du routeur client
const clientRoutes = require('./client/routes/ClientRouter'); 

// Middlewares
app.use(express.json());
app.use(cookieParser()); // Utilise la constante importée plus haut

// Branchement des routes (Spécifications fonctionnelles 4.2)
app.use('/api/auth', clientRoutes);

// Route de diagnostic
app.get("/health", (req, res) => {
    res.json({
        status: "Ok",
        timestamp: new Date().toISOString(),
        message: "L'API TaskFlow est opérationnelle",
    });
});

// Gestion des erreurs 404
app.use((req, res) => {
    res.status(404).json({ error: "Ressource non trouvée", path: req.originalUrl });
});

// Gestion des erreurs serveurs (500)
app.use((err, req, res, next) => {
    console.error("Erreur Server :", err.stack);
    res.status(500).json({
        message: "Une erreur interne est survenue sur le serveur."
    });
});

app.listen(port, () => {
    console.log(`Le backend de TaskFlow tourne sur http://localhost:${port}`);
});