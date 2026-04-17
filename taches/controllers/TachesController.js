const TacheModel = require("../models/TachesModel");
const db = require("../../db");

const getProjectTasks = async (req, res) => {
    try {
        // On récupère l'ID du projet depuis les paramètres de l'URL
        const { projectId } = req.params;
        const tasks = await TacheModel.getTasksByProject(projectId);
        
        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la récupération des tâches" });
    }
};

const addTask = async (req, res) => {
    try {
        const { nom_taches, statut_taches, description_taches, date_butoire, temps_prevu_taches } = req.body;
        const { projectId } = req.params;

        const id = await TacheModel.createTache({
            nom: nom_taches,
            statut: statut_taches || 'À faire',
            description: description_taches,
            date_butoire: date_butoire,
            temps_prevu: temps_prevu_taches,
            id_projet: projectId
        });

        res.status(201).json({ 
            message: "Tâche ajoutée au Kanban !", 
            id_taches: id 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la création de la tâche" });
    }
};

const updateTaskStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { statut_taches, temps_reel_taches } = req.body;
        
        const rowCount = await TacheModel.updateTask(id, {
            statut: statut_taches,
            temps_reel: temps_reel_taches
        });

        if (rowCount === 0) {
            return res.status(404).json({ message: "Tâche non trouvée" });
        }

        res.json({ message: "Statut mis à jour" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la mise à jour" });
    }
};

const removeTache = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Contrôleur : Tentative de suppression de la tâche", id);

        // On vérifie si la tâche existe avant de supprimer
        const check = await db.query('SELECT * FROM "taches" WHERE id_taches = $1', [id]);
        
        if (check.rows.length === 0) {
            return res.status(404).json({ message: "La tâche n'existe pas." });
        }

        // Suppression
        await db.query('DELETE FROM "taches" WHERE id_taches = $1', [id]);

        return res.status(200).json({ message: "Tâche supprimée avec succès." });

    } catch (error) {
        console.error("ERREUR DANS LE CONTRÔLEUR :", error.message);
        return res.status(500).json({ 
            message: "Erreur lors de la suppression de la tâche",
            error: error.message 
        });
    }
};

const assignUser = async (req, res) => {
    try {
        const { id_taches, id_utilisateur } = req.body;
        
        await TacheModel.assignUserToTask(id_taches, id_utilisateur);
        
        res.status(201).json({ message: "Utilisateur assigné à la tâche !" });
    } catch (error) {
        console.error("Détail erreur assignation:", error.message);
        res.status(500).json({ 
            message: "Erreur lors de l'assignation", 
            error: error.message 
        });
    }
};

module.exports = { 
    getProjectTasks, 
    addTask, 
    updateTaskStatus, 
    removeTache, 
    assignUser 
};