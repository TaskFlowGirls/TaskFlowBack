const express = require('express');
const router = express.Router();
const ClientController = require('../controllers/ClientController');
const verifyToken = require('../../middleware/authMiddleware'); // Import direct de la fonction

console.log("--- VÉRIFICATION DES TYPES ---");
console.log("verifyToken est une fonction :", typeof verifyToken === 'function');
console.log("ClientController.getProfil est une fonction :", typeof ClientController.getProfil === 'function');
console.log("------------------------------");

// Si les logs ci-dessus affichent "false", le problème est dans le fichier importé, pas ici.

router.post('/register', ClientController.register);
router.post('/login', ClientController.login);
router.post('/logout', ClientController.logout);
router.post('/check-email', ClientController.checkEmail);
router.put('/reset-password', ClientController.resetPassword);

// Route profil
router.get('/profil', verifyToken, ClientController.getProfil);

module.exports = router;
