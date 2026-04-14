const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Serveur TaskFlow opérationnel !');
});

// Fichiers statiques
app.use('/images', express.static(Path2D.join(__dirname, 'public/images')));

// Route de l'API


// Route de diagnostique
app.get("/health", (req, res) => {
    res.json({
        status: "Ok",
        timestamp: new Date().toISOString(),
        message: "L'API TaskFlow est opérationnelle",
    });
});

// Gestion des erreurs
app.use((req, res) => {
    res.status(404).json({ error: "Ressource non trouvée", path: req.orginalUrl });
});

app.use((err, req, res, next) => {
    console.error("Erreur Server :", err.stack);
    res.status(500).json({
        message: "Une erreur interne est survenue sur le serveur.",
        error: process.env.NOFR_ENV
    });
});

app.listen(port, () => {
    console.log(`Le backend de TaskFlow tourne sur http://localhost:${port}`);
});