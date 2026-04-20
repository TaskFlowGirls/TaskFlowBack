const express = require('express');
const cookieParser = require('cookie-parser'); //
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Autorise les connexions
const cors = require('cors');
app.use(cors());

// Import du routeur client
const clientRoutes = require('./client/routes/ClientRouter');
const projetRoutes = require('./projets/routes/ProjetsRouter');
const tacheRoutes = require('./taches/routes/TachesRouter');

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Branchement des routes
app.use('/api/auth', clientRoutes);
app.use('/api/projets', projetRoutes);
app.use('/api/taches', tacheRoutes);

// Route de diagnostic
app.get('/health', (req, res) => {
  res.json({
    status: 'Ok',
    timestamp: new Date().toISOString(),
    message: "L'API TaskFlow est opérationnelle",
  });
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ressource non trouvée', path: req.originalUrl });
});

// Gestion des erreurs serveurs (500)
app.use((err, req, res) => {
  console.error('Erreur Server :', err.stack);
  res.status(500).json({
    message: 'Une erreur interne est survenue sur le serveur.',
  });
});

app.listen(port, () => {
  console.log(`Le backend de TaskFlow tourne sur http://localhost:${port}`);
});
