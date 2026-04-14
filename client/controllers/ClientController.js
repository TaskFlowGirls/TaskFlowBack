const register = async (req, res) => {
    try {
        const { nom, prenom, email, mdp } = req.body;

        // Validation CDC: 12 caractères + complexité (exemple simplifié ici)
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
        if (!passwordRegex.test(mdp)) {
            return res.status(400).json({ message: "Le mot de passe ne respecte pas les critères de sécurité." });
        }

        const existingClient = await ClientModel.findClientByEmail(email);
        if (existingClient) return res.status(400).json({ message: "Email déjà utilisé" });

        const hashedPassword = await ClientModel.hashPassword(mdp);
        await ClientModel.createClient({ nom, prenom, email, mdp: hashedPassword });
        
        res.status(201).json({ message: "Compte créé avec succès !" });
    } catch (error) {
        res.status(500).json({ message: "Erreur inscription", error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, mdp } = req.body;
        const client = await ClientModel.findClientByEmail(email);
        
        if (!client || !(await ClientModel.comparePassword(mdp, client.mot_de_passe))) {
            return res.status(401).json({ message: "Identifiants invalides." });
        }

        const token = jwt.sign(
            { id: client.id_utilisateur },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        // Envoi via cookie httpOnly comme exigé par le CDC
        res.cookie("token", token, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000 // 24h
        });

        res.json({ message: "Connexion réussie", user: { nom: client.nom, prenom: client.prenom } });
    } catch (error) {
        res.status(500).json({ message: "Erreur de connexion" });
    }
};

// Déconnexion
const logout = async (req, res) => {
    try {
        // Le serveur invalide le cookie en le supprimant ou en mettant une date expirée 
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'strict'
        });
        
        res.json({ message: "Déconnexion réussie. Redirection vers l'accueil..." });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la déconnexion" });
    }
};