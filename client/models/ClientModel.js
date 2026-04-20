const bcrypt = require('bcryptjs');
const db = require('../../db');

// Récupère un utilisateur par son email
const findClientByEmail = async (email) => {
  const query = 'SELECT * FROM "utilisateurs" WHERE "adresse_mail" = $1';

  // Avec le driver 'pg', on récupère les données dans .rows
  const result = await db.query(query, [email]);
  return result.rows[0];
};

// Crée un nouvel utilisateur
const createClient = async (data) => {
  const {
    nom, prenom, email, mdp,
  } = data;

  const query = `
        INSERT INTO "utilisateurs" ("nom", "prenom", "adresse_mail", "mot_de_passe") 
        VALUES ($1, $2, $3, $4) 
        RETURNING "id_utilisateur"
    `;

  const result = await db.query(query, [nom, prenom, email, mdp]);
  return result.rows[0];
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

module.exports = {
  findClientByEmail,
  createClient,
  hashPassword,
  comparePassword,
};
