const express = require('express');
const router = express.Router();
const TacheController = require('../controllers/TachesController');
const { verifyToken } = require('../../middleware/authMiddleware');

// Récupérer les tâches d'un projet
router.get("/projet/:projectId", verifyToken, TacheController.getProjectTasks);

// Ajouter une tâche à un projet
router.post("/projet/:projectId", verifyToken, TacheController.addTask);

// Modifier une tâche pour le Drag & Drop ou le temps réel
router.put("/:id", verifyToken, TacheController.updateTaskStatus);

// Supprimer une tâche 
router.delete("/:id", verifyToken, TacheController.removeTache);

module.exports = router;