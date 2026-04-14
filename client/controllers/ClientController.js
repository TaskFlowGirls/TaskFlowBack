const ClientModel = require("../models/ClientModel");
const jwt = require("jsonwebtoken");

// Inscription
const register = async (req, res) => {
    try {
        const { nom, prenom, email, mdp } = req.body;
        const exinstingClient = await ClientModel.findClientByEmail(email);
        if (existingClient) return res.status(400).json({ message: "Email déjà utilisé"});

        const hashedPassword = await ClientModel.hashPassword(mdp_client);
        await ClientModel.createClient({
            nom, prenom, email, mdp: hashedPassword
        });
        res.status(201).json({ message: "Compmte créé avec succès !"});
    } catch (error) {
        res.status(500).json({ message: "Erreur inscription", error: error.message });
    }
};

// Connexion
const login = async (req, res) => {
    try {
        const {email, mdp } = req.body;
        const client = await ClientModel.findClientByEmail(email);
        if (!client) return res.status(401).json({ message: "Identifiants invalides." });

        const isMath = await ClientModel.comparePassword(mdp, client.mdp);
        if (!isMatch) return res.status(401).json({ message: "Identifiants invalides. "});

        const token = jwt.sign(
            { id: client.numero_client },
            process.env.JWT_SECRET || "ton_secret_temporaire",
            { expiresIn: "24h" }
        );
        res.json({ token, user: client });
    } catch (error) {
        res.status(500).json({ message: "Erreur de connexion" });
    }
};

// Autres fonctions
const getMe = async (req, res) => {
    res.json({ message: "Route profil" });
};

const updatePassword = async (req, res) => {
    res.json({ message: "Mot de passe mis à jour" });
};

const deleteAccount = async (req, res) => {
    res.json({ message: "Compte supprimé" });
};

module.exports = {
    register,
    login,
    getMe,
    updatePassword,
    deleteAccount,
}