const express = require('express');
const router = express.Router();
const TacheController = require('../controllers/TacheController');
const { verifyToken } = require('../../middleware/authMiddleware');

// Récupérer les tâches d'un projet
router.get("/projet/:projectId", verifyToken, TacheController.getProjectTasks);

// Ajouter une tâche à un projet
router.post("/projet/:projectId", verifyToken, TacheController.addTask);

// Modifier une tâche pour le Drag & Drop ou le temps réel
router.put("/:id", verifyToken, TacheController.updateTaskStatus);

module.exports = router;