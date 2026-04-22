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

const addTask = async (req, res) => {
  try {
    const {
      nomTaches, statutTaches, descriptionTaches, dateButoire, tempsPrevuTaches,
    } = req.body;
    const { projectId } = req.params;

    const id = await TacheModel.createTache({
      nom: nomTaches,
      statut: statutTaches || 'À faire',
      description: descriptionTaches,
      dateButoire,
      temps_prevu: tempsPrevuTaches,
      id_projet: projectId,
    });

    return res.status(201).json({
      message: 'Tâche ajoutée au Kanban !',
      id_taches: id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur lors de la création de la tâche' });
  }
};

// Efface une tâche définitivement de la base de données
const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { statutTaches, tempsReelTaches } = req.body;

    const rowCount = await TacheModel.updateTask(id, {
      statut_taches: statutTaches,
      temps_reel_taches: tempsReelTaches,
    });

    if (rowCount === 0) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }

    return res.json({ message: 'Statut mis à jour' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur lors de la mise à jour' });
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
