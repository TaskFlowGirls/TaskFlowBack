const express = require('express');
const router = express.Router();

// 1. Vérifie bien l'orthographe ici (ajoute ou enlève le 's' pour que ce soit identique partout)
const ProjetsController = require('../controllers/ProjetsController'); 

const { verifyToken } = require('../../middleware/authMiddleware'); 
const { checkProjectRole } = require('../../middleware/roleMiddleware'); 

// 2. Utilise EXACTEMENT le même nom ici
router.post("/inviter", verifyToken, checkProjectRole(['Chef de projet', 'Admin']), ProjetsController.inviteMember);

router.get("/:projectId/membres", verifyToken, checkProjectRole(['Chef de projet', 'Collaborateur', 'Admin']), ProjetsController.getProjectMembers);
module.exports = router;