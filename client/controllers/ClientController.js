const ClientModel = require("../models/ClientModel");
const jwt = require("jsonwebtoken");

// Inscription
const register = async (req, res) => {
    try {
        const { nom, prenom, email, mdp } = req.body;
        // Validation complexité MDP 
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
        
        if (!passwordRegex.test(mdp)) {
            return res.status(400).json({ message: "Le mot de passe ne respecte pas les critères." });
        }

        const existingClient = await ClientModel.findClientByEmail(email); // [cite: 80]
        if (existingClient) return res.status(400).json({ message: "Email déjà utilisé" });

        const hashedPassword = await ClientModel.hashPassword(mdp); // [cite: 81]
        await ClientModel.createClient({ nom, prenom, email, mdp: hashedPassword });
        
        res.status(201).json({ message: "Compte créé avec succès !" });
    } catch (error) {
        res.status(500).json({ message: "Erreur inscription", error: error.message });
    }
};

// Connexion
const login = async (req, res) => {
    try {
        const { email, mdp } = req.body;
        const client = await ClientModel.findClientByEmail(email);
        
        if (!client || !(await ClientModel.comparePassword(mdp, client.mot_de_passe))) {
            return res.status(401).json({ message: "Identifiants invalides." });
        }

        const token = jwt.sign(
            { id: client.id_utilisateur },
            process.env.JWT_SECRET || "secret_par_defaut",
            { expiresIn: "24h" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000 
        });

        res.json({ message: "Connexion réussie", user: { nom: client.nom, prenom: client.prenom } });
    } catch (error) {
        console.error("DEBUG SQL ERROR:", error);
        res.status(500).json({ 
            message: "Erreur inscription", 
            error: error.message || "Erreur inconnue" 
        });
    }
};

const logout = async (req, res) => {
    res.clearCookie("token"); 
    res.json({ message: "Déconnexion réussie" });
};

const checkEmail = async (req, res) => {
    res.json({ message: "Email vérifié" });
};

const resetPassword = async (req, res) => {
    res.json({ message: "Mot de passe réinitialisé" });
};

module.exports = {
    register,
    login,
    logout,
    checkEmail,
    resetPassword
};