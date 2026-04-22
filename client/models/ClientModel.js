const bcrypt = require('bcryptjs');
const db = require('../../db');

// Récupère un utilisateur par son email
const getClientByEmail = async (email) => {
  const query = 'SELECT * FROM "utilisateurs" WHERE "adresse_mail" = $1';

  // Avec le driver 'pg', on récupère les données dans .rows
  const result = await db.query(query, [email]);
  return result.rows[0];
};

// Crée un nouvel utilisateur
// Dans ton modèle, ajoute ce log pour voir ce qui arrive à la base
const createClient = async (data) => {
  const {
    nom,
    prenom,
    email,
    password,
  } = data;

  const query = `
      INSERT INTO "utilisateurs" ("nom", "prenom", "adresse_mail", "mot_de_passe") 
      VALUES ($1, $2, $3, $4) 
      RETURNING "id_utilisateur"
  `;

  try {
    const result = await db.query(query, [nom, prenom, email, password]);
    return result.rows[0];
  } catch (err) {
    console.error('Erreur SQL:', err);
    throw err;
  }
};

// Hachage du mot de passe
const hashPassword = async (password) => {
  if (!password) throw new Error('Mot de passe manquant');
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Comparaison pour le login
const comparePassword = async (password, hash) => {
  if (!password || !hash) return false;
  return bcrypt.compare(password, hash);
};

// Récupère un utilisateur par son ID
const getClientById = async (id) => {
  const query = 'SELECT * FROM "utilisateurs" WHERE "id_utilisateur" = $1';
  const result = await db.query(query, [id]);
  return result.rows[0];
};

module.exports = {
  getClientByEmail,
  getClientById,
  createClient,
  hashPassword,
  comparePassword,
};
