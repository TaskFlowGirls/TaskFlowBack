const express = require('express');
const router = express.Router();
const ClientController = require('../controllers/ClientController');

// Connexion
router.post("/login", ClientController.login);

// Vérifier l'existance de l'email
// Utilsié par ForgotPassword.jsx
router.post("/chek-email", ClientController.checkEmail);

// Réinitialiser le mot de passe
// Utilisé par ForgotPassword.jsx
router.put("/reset-password", ClientController.resetPassword);

module.exports = router;