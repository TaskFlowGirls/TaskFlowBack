const express = require('express');

const router = express.Router();
const ProjetsController = require('../controllers/ProjetsController');
// On importe le middleware original qui définit req.user
const verifyToken = require('../../middleware/authMiddleware');

// 1. Dashboard : accès aux projets de l'utilisateur connecté
router.get('/', verifyToken, ProjetsController.getDashboard);

// 2. Invitation
router.post('/inviter', verifyToken, ProjetsController.inviteMember);

// 3. Membres du projet
router.get('/:projectId/membres', verifyToken, ProjetsController.getProjectMembers);

// 4. Création de projet
router.post('/', verifyToken, ProjetsController.addProjet);

module.exports = router;
