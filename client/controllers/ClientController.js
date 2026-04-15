const ClientModel = require("../models/ClientModel");
const jwt = require("jsonwebtoken");

// --- INSCRIPTION ---
const register = async (req, res) => {
    try {
        const { nom, prenom, email, mdp } = req.body;

        // Validation de la complexité du MDP (12 caractères, Maj, Min, Chiffre, Spécial)
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
        
        if (!passwordRegex.test(mdp)) {
            return res.status(400).json({ 
                message: "Le mot de passe ne respecte pas les critères (12 caractères mini, Maj, Min, Chiffre, Spécial)." 
            });
        }

        // Vérification si l'email existe déjà
        const existingClient = await ClientModel.findClientByEmail(email);
        if (existingClient) {
            return res.status(400).json({ message: "Email déjà utilisé." });
        }

        // Hachage et création
        const hashedPassword = await ClientModel.hashPassword(mdp);
        
        // Postgres retourne l'objet créé via RETURNING dans le modèle
        const newClient = await ClientModel.createClient({ 
            nom, 
            prenom, 
            email, 
            mdp: hashedPassword 
        });
        
        res.status(201).json({ 
            message: "Compte créé avec succès !",
            userId: newClient.id_utilisateur 
        });
    } catch (error) {
        console.error("Erreur Inscription:", error);
        res.status(500).json({ message: "Erreur lors de l'inscription", error: error.message });
    }
};

// --- CONNEXION ---
const login = async (req, res) => {
    try {
        const { email, mdp } = req.body;
        
        // Recherche du client
        const client = await ClientModel.findClientByEmail(email);
        
        // Vérification existence et mot de passe
        // On vérifie client.mot_de_passe (attention au nom de la colonne en BDD)
        if (!client || !(await ClientModel.comparePassword(mdp, client.mot_de_passe))) {
            return res.status(401).json({ message: "Identifiants invalides." });
        }

        // Génération du Token avec ID et RÔLE
        const token = jwt.sign(
            { 
                id: client.id_utilisateur,
                role: client.role_utilisateur 
            },
            process.env.JWT_SECRET || "secret_par_defaut",
            { expiresIn: "24h" }
        );

        // Envoi du cookie HTTPOnly
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'Lax',
            maxAge: 24 * 60 * 60 * 1000 
        });

        res.json({ 
            message: "Connexion réussie", 
            user: { 
                nom: client.nom, 
                prenom: client.prenom,
                role: client.role_utilisateur 
            } 
        });
    } catch (error) {
        console.error("Erreur Login:", error);
        res.status(500).json({ message: "Erreur lors de la connexion" });
    }
};

// --- DÉCONNEXION ---
const logout = async (req, res) => {
    res.clearCookie("token"); 
    res.json({ message: "Déconnexion réussie" });
};

// --- MOT DE PASSE OUBLIÉ / AUTRES ---
const checkEmail = async (req, res) => {
    res.json({ message: "Fonctionnalité de vérification d'email à implémenter" });
};

const resetPassword = async (req, res) => {
    res.json({ message: "Fonctionnalité de réinitialisation à implémenter" });
};

module.exports = {
    register,
    login,
    logout,
    checkEmail,
    resetPassword
};