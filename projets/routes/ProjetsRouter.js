const express = require('express');
const router = express.Router();

const ProjetsController = require('../controllers/ProjetsController'); 

const { verifyToken } = require('../../middleware/authMiddleware'); 
const { checkProjectRole } = require('../../middleware/roleMiddleware'); 

router.post("/inviter", verifyToken, checkProjectRole(['Chef de projet', 'Admin']), ProjetsController.inviteMember);

router.get("/:projectId/membres", verifyToken, checkProjectRole(['Chef de projet', 'Collaborateur', 'Admin']), ProjetsController.getProjectMembers);
module.exports = router;