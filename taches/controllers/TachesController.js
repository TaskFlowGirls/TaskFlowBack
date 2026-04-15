const TacheModel = require("../models/TachesModel");

const getProjectTasks = async (req, res) => {
    try {
        const { projectId } = req.params;
        const tasks = await TacheModel.getTasksByProject(projectId);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des tâches" });
    }
};

const addTask = async (req, res) => {
    try {
        const { nom_taches, statut_taches, description_taches, date_butoire, temps_prevu_taches } = req.body;
        const { projectId } = req.params;

        const id = await TacheModel.createTask({
            nom: nom_taches,
            statut: statut_taches || 'À faire',
            description: description_taches,
            date_butoire: date_butoire,
            temps_prevu: temps_prevu_taches,
            id_projet: projectId
        });

        res.status(201).json({ message: "Tâche ajoutée au Kanban !", id_taches: id });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création de la tâche" });
    }
};

const updateTaskStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { statut_taches, temps_reel_taches } = req.body;
        
        await TacheModel.updateTask(id, {
            statut: statut_taches,
            temps_reel: temps_reel_taches
        });

        res.json({ message: "Statut mis à jour" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour" });
    }
};

const removeTache = async (req, res) => {
    try {
        const { id } = req.params;
        await TacheModel.deleteTask(id); // On appelle la méthode du modèle
        res.json({ message: "La tâche a bien été supprimée." });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression de la tâche" });
    }
};

module.exports = { getProjectTasks, addTask, updateTaskStatus, removeTache };