const db = require("../../db");
const bcrypt = require("bcryptjs");

// Récupère un utilisateur par son email
const findClientByEmail = async (email) => {
    // On cherche dans la table 'utilisateurs' sur la colonne 'adresse_mail' [cite: 80, 139]
    const [rows] = await db.query("SELECT * FROM utilisateurs WHERE adresse_mail = ?", [email]);
    return rows[0];
};

// Crée un nouvel utilisateur
const createClient = async (data) => {
    const { nom, prenom, email, mdp } = data;

    const [result] = await db.query(
        "INSERT INTO utilisateurs (nom, prenom, adresse_mail, mot_de_passe) VALUES (?, ?, ?, ?)",
        [nom, prenom, email, mdp]
    );

    return result;
};

// Hachage du mot de passe
const hashPassword = async (password) => {
    if (!password) throw new Error("Mot de passe manquant");
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

// Comparaison pour le login
const comparePassword = async (password, hash) => {
    if (!password || !hash) return false;
    return await bcrypt.compare(password, hash);
};

module.exports = {
    findClientByEmail,
    createClient,
    hashPassword,
    comparePassword
};