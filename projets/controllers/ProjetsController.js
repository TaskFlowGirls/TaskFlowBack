const ProjetModel = require("../models/ProjetModel");

const getDashboard = async (req, res) => {
    try {
        const userId = req.user.id; // Récupéré grâce à verifyToken
        const projets = await ProjetModel.getUserProjects(userId);

        // On calcule le pourcentage d'avancement pour chaque projet
        const projetsAvecStats = projets.map(p => {
            const total = p.total_taches || 0;
            const terminees = p.taches_terminees || 0;
            const avancement = total > 0 ? Math.round((terminees / total) * 100) : 0;
            
            return {
                ...p,
                pourcentage_avancement: avancement
            };
        });

        res.json(projetsAvecStats);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des projets" });
    }
};

const addProjet = async (req, res) => {
    try {
        const { type_projet, nom_projet, description_projet } = req.body;
        // Le créateur devient automatiquement chef de projet (exigence 4.3.1)
        const id_projet = await ProjetModel.createProjet({
            type: type_projet,
            nom: nom_projet,
            description: description_projet,
            id_createur: req.user.id
        });

        res.status(201).json({ message: "Projet créé !", id_projet });
    } catch (error) {
        res.status(500).json({ message: "Erreur création projet" });
    }
};

module.exports = { getDashboard, addProjet };