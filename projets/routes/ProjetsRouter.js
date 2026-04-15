const express = require('express');
const router = express.Router();
const ProjetController = require('../controllers/ProjetsController');
const { verifyToken } = require('../../middleware/authMiddleware'); // Ton badge de sécurité

// Route protégée pour le dashboard
router.get("/dashboard", verifyToken, ProjetController.getDashboard);

// Route pour créer un projet
router.post("/create", verifyToken, ProjetController.addProjet);

module.exports = router;