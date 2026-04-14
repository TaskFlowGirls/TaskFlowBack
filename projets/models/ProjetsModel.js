const logout = async (req, res) => {
    try {
        // Le serveur invalide le cookie en le supprimant ou en mettant une date expirée 
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'strict'
        });
        
        res.json({ message: "Déconnexion réussie. Redirection vers l'accueil..." })
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la déconnexion" });
    }
};