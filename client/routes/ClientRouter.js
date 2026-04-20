const express = require('express');

const router = express.Router();
const ClientController = require('../controllers/ClientController');

// L'email unique et le MDP de 12 caractères
router.post('/register', ClientController.register);

// Cette route doit générer le cookie httpOnly
router.post('/login', ClientController.login);

// Pour invalider le cookie côté serveur
router.post('/logout', ClientController.logout);
router.post('/check-email', ClientController.checkEmail);
router.put('/reset-password', ClientController.resetPassword);

module.exports = router;
