const db = require("../../db");

// Récupérer toutes les tâches d'un projet spécifique pour le Kanban
const getTasksByProject = async (projectId) => {
    const query = `SELECT * FROM tâches WHERE id_projet = ? ORDER BY date_butoire ASC`;
    const [rows] = await db.query(query, [projectId]);
    return rows;
};

// Créer une tâche 
const createTask = async (data) => {
    const { nom, statut, description, date_butoire, id_projet, temps_prevu } = data;
    const query = `INSERT INTO tâches (nom_taches, statut_taches, description_taches, date_butoire, id_projet, temps_prevu_taches) 
                VALUES (?, ?, ?, ?, ?, ?)`;
    const [result] = await db.query(query, [nom, statut, description, date_butoire, id_projet, temps_prevu]);
    return result.insertId;
};

// Mettre à jour une tâche pour le Drag & Drop
const updateTask = async (id, data) => {
    const { statut, temps_reel } = data;
    // Si la tâche passe à Terminé, on peut aussi mettre à jour le temps réel
    const query = `UPDATE tâches SET statut_taches = ?, temps_reel_taches = ? WHERE id_taches = ?`;
    const [result] = await db.query(query, [statut, temps_reel, id]);
    return result;
};

// Supprimer une tâche
const deleteTask = async (id) => {
    const query = `DELETE FROM tâches WHERE id_taches = ?`;
    const [result] = await db.query(query, [id]);
    return result;
};

module.exports = { getTasksByProject, createTask, updateTask, deleteTask };