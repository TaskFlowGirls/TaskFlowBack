const express = require('express');

const router = express.Router();
const TacheController = require('../controllers/TachesController');
const { verifyToken } = require('../../middleware/authMiddleware');
const { checkProjectRole } = require('../../middleware/roleMiddleware'); // Import ici

// Récupérer les tâches
router.get('/projet/:projectId', verifyToken, checkProjectRole(['Chef de projet', 'Collaborateur', 'Admin']), TacheController.getProjectTasks);

// Ajouter une tâche
router.post('/projet/:projectId', verifyToken, checkProjectRole(['Chef de projet', 'Admin']), TacheController.addTask);

// Modifier une tâche
router.put('/:id', verifyToken, TacheController.updateTaskStatus);

// Supprimer une tâche
router.delete('/:id', verifyToken, checkProjectRole(['Chef de projet', 'Admin']), TacheController.removeTache);

// Assigner une tâche
router.post('/assign', verifyToken, checkProjectRole(['Chef de projet', 'Admin']), TacheController.assignUser);

// On vérifie que l'utilisateur est bien dans le projet avant de le laisser modifier la tâche
router.patch(
  '/:id',
  verifyToken,
  checkProjectRole(['Chef de projet', 'Collaborateur']),
  TacheController.updateTaskStatus,
);

module.exports = router;
