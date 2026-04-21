const jwt = require('jsonwebtoken');
const ClientModel = require('../models/ClientModel');

// Inscription
const register = async (req, res) => {
  try {
    const {
      nom,
      prenom,
      email,
      password,
    } = req.body;

    // Validation ...
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: 'Le mot de passe ne respecte pas les critères...' });
    }

    const existingClient = await ClientModel.findClientByEmail(email);
    if (existingClient) {
      return res.status(400).json({ message: 'Email déjà utilisé.' });
    }

    const hashedPassword = await ClientModel.hashPassword(password);

    const newClient = await ClientModel.createClient({
      nom,
      prenom,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: 'Compte créé avec succès !',
      userId: newClient.id_utilisateur,
    });
  } catch (error) { // <-- Cette accolade ferme le TRY
    console.error('ERREUR DÉTAILLÉE :', error);
    return res.status(500).json({
      message: "Erreur lors de l'inscription",
      error: error.message || String(error),
    });
  } // <-- CETTE ACCOLADE FERME LE CATCH
}; // <-- CETTE ACCOLADE FERME LA FONCTION register

// Connexion
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const client = await ClientModel.findClientByEmail(email);

    if (!client || !(await ClientModel.comparePassword(password, client.mot_de_passe))) {
      return res.status(401).json({ message: 'Identifiants invalides.' });
    }

    const token = jwt.sign(
      { id: client.id_utilisateur, role: client.role_utilisateur },
      process.env.JWT_SECRET || 'secret_par_defaut',
      { expiresIn: '24h' }
    );

    // On envoie le token ici, plus besoin de res.cookie
    return res.status(200).json({
      message: 'Connexion réussie',
      token: token, // <--- C'est ça que le frontend va lire
      user: {
        nom: client.nom,
        prenom: client.prenom,
        role: client.role_utilisateur,
      },
    });
  } catch (error) {
    console.error('Erreur Login:', error);
    return res.status(500).json({ message: 'Erreur lors de la connexion' });
  }
};

// Déconnexion
const logout = async (req, res) => {
  res.clearCookie('token');
  return res.json({ message: 'Déconnexion réussie' });
};

// Mot de passe oublié / autres
const checkEmail = async (req, res) => {
  res.json({ message: "Fonctionnalité de vérification d'email à implémenter" });
};

const resetPassword = async (req, res) => {
  res.json({ message: 'Fonctionnalité de réinitialisation à implémenter' });
};

module.exports = {
  register,
  login,
  logout,
  checkEmail,
  resetPassword,
};
