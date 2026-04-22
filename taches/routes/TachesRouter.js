const express = require('express');
const router = express.Router();

// Importations
const TacheController = require('../controllers/TachesController');
const verifyToken = require('../../middleware/authMiddleware');
const roleMiddleware = require('../../middleware/roleMiddleware');

// Diagnostic : on vérifie que tout est bien défini avant d'initialiser les routes
console.log("DEBUG TachesRouter - TacheController:", !!TacheController);
console.log("DEBUG TachesRouter - checkProjectRole:", !!roleMiddleware.checkProjectRole);

// Routes sécurisées
router.get('/projet/:projectId', 
    verifyToken, 
    roleMiddleware.checkProjectRole(['Chef de projet', 'Collaborateur', 'Admin']), 
    TacheController.getProjectTasks
);

router.post('/projet/:projectId', 
    verifyToken, 
    roleMiddleware.checkProjectRole(['Chef de projet', 'Admin']), 
    TacheController.addTask
);

router.put('/:id', 
    verifyToken, 
    TacheController.updateTaskStatus
);

router.delete('/:id', 
    verifyToken, 
    roleMiddleware.checkProjectRole(['Chef de projet', 'Admin']), 
    TacheController.removeTache
);

router.post('/assign', 
    verifyToken, 
    roleMiddleware.checkProjectRole(['Chef de projet', 'Admin']), 
    TacheController.assignUser
);

router.patch('/:id', 
    verifyToken, 
    roleMiddleware.checkProjectRole(['Chef de projet', 'Collaborateur']), 
    TacheController.updateTaskStatus
);

module.exports = router;