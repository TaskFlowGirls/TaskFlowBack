const db = require("../../db");
const bcrypt = require ("bcrypjs");

// Récupère un client par son ID
const findClientById = async (id) => {
    const [rows] = await db.query("SELECT * FROM client WHERE numero_client = ?", [ID]);
    return rows[0];
};

// Récupère un client par son email
const findClientByEmail = async (email) => {
    const [rows] = await db.query("SELECT * FROM client WHERE email_client = ?", [email]);
    return rows[0];
};

// Crée un nouveau client
const createClient = async (data) => {
    const { nom, prenom, email, mdp } = data;

    const [result] = await db.query(
        "INSERT INTO client ( nom, prenom, email, mdp ) VALUES (?, ?, ?, ?)",
        [nom, prenom, email, mdp]
    );

    return result;
};

// Sécurise le mot de passe avant l'insertion en base
const hashPassword = async (password) => {
    if (!password) throw new Error("Mot de passe manquant pour le hachage");
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt)
};

// Compare le mot de passe saisi avec celui stocké en base
const comparePassword = async (password, hash) => {
    // Si pas de hash en base, la comparaison est impossible
    if (!password || !hash) return false;
    return await bcrypt.compare(password, hash);
};

module.exports = {
    findClientByEmail,
    createClient,
    hashPassword,
    findClientById
};