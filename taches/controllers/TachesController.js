const TacheModel = require('../models/TachesModel');
const db = require('../../db');

// Récupère la liste de toutes les tâches associés à un projet
const getProjectTasks = async (req, res) => {
  try {
    // On récupère l'ID du projet depuis les paramètres de l'URL
    const { projectId } = req.params;
    const tasks = await TacheModel.getTasksByProject(projectId);

    return res.json(tasks);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur lors de la récupération des tâches' });
  }
};

// Dans TachesController.js
const addTask = async (req, res) => {
    try {
        const { 
            nom_taches, description_taches, date_butoire, 
            date_debut_taches, date_fin_taches, 
            temps_prevu_taches, id_projet 
        } = req.body;

        // DEBUG ULTIME : Regarde ce qui arrive VRAIMENT dans le serveur
        console.log("--- DEBUG API ---");
        console.log("Nom:", nom_taches);
        console.log("Date Butoire reçue:", date_butoire);
        console.log("Date Début reçue:", date_debut_taches);
        console.log("Date Fin reçue:", date_fin_taches);
        console.log("-----------------");

        const id = await TacheModel.createTache({
            nom: nom_taches,
            description: description_taches,
            date_butoire,
            date_debut: date_debut_taches,
            date_fin: date_fin_taches,
            temps: temps_prevu_taches,
            idProjet: id_projet,
        });

        return res.status(201).json({ id_taches: id });
    } catch (error) {
        console.error("Erreur dans addTask :", error);
        return res.status(500).json({ message: 'Erreur lors de la création' });
    }
};

// Efface une tâche définitivement de la base de données
const updateTaskStatus = async (req, res) => {
    try {
        const { id } = req.params;
        // On extrait bien dateFinTaches ici pour ne plus avoir l'erreur "is not defined"
        const { statutTaches, tempsReelTaches, dateFinTaches } = req.body;

        // Force une valeur par défaut si c'est vide
        const statutFinal = statutTaches || 'À faire';
        const tempsFinal = tempsReelTaches || 0;

        console.log("Valeurs envoyées au modèle :", { 
            statutFinal, 
            tempsFinal, 
            dateFinTaches 
        });

        // Appel au modèle avec la nouvelle donnée
        const rowCount = await TacheModel.updateTask(id, {
            statut_taches: statutFinal,
            temps_reel_taches: tempsFinal,
            date_fin_taches: dateFinTaches
        });

        return res.json({ 
            message: 'Statut et date mis à jour', 
            nouveauStatut: statutFinal,
            dateFin: dateFinTaches 
        });
    } catch (error) {
        console.error("Erreur lors de la mise à jour :", error);
        return res.status(500).json({ 
            message: 'Erreur lors de la mise à jour', 
            error: error.message 
        });
    }
};

// C'est ce qui permet de savoir qui s'occupe de tel ou tel tâche
const removeTache = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Contrôleur : Tentative de suppression de la tâche', id);

    // On vérifie si la tâche existe avant de supprimer
    const check = await db.query('SELECT * FROM "taches" WHERE id_taches = $1', [id]);

    if (check.rows.length === 0) {
      return res.status(404).json({ message: "La tâche n'existe pas." });
    }

    // Suppression
    await db.query('DELETE FROM "taches" WHERE id_taches = $1', [id]);

    return res.status(200).json({ message: 'Tâche supprimée avec succès.' });
  } catch (error) {
    console.error('ERREUR DANS LE CONTRÔLEUR :', error.message);
    return res.status(500).json({
      message: 'Erreur lors de la suppression de la tâche',
      error: error.message,
    });
  }
};

const assignUser = async (req, res) => {
  try {
    const { idTaches, idUtilisateur } = req.body;

    await TacheModel.assignUserToTask(idTaches, idUtilisateur);

    return res.status(201).json({ message: 'Utilisateur assigné à la tâche !' });
  } catch (error) {
    console.error('Détail erreur assignation:', error.message);
    return res.status(500).json({
      message: "Erreur lors de l'assignation",
      error: error.message,
    });
  }
};

module.exports = {
  getProjectTasks,
  addTask,
  updateTaskStatus,
  removeTache,
  assignUser,
};
