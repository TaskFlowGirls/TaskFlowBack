const db = require('../../db');

// Récupérer toutes les tâches d'un projet spécifique pour le Kanban
const getTasksByProject = async (projectId) => {
  const query = 'SELECT * FROM "taches" WHERE "id_projet" = $1 ORDER BY "date_butoire" ASC';
  const result = await db.query(query, [projectId]);
  return result.rows;
};

const updateTask = async (id, data) => {
  const { statut_taches, temps_reel_taches } = data; 

  const query = `
        UPDATE "taches" 
        SET "statut_taches" = $1, "temps_reel_taches" = $2 
        WHERE "id_taches" = $3
    `;

  const result = await db.query(query, [statut_taches, temps_reel_taches, id]);
  return result.rowCount;
};

// Créer une tâche
const createTache = async (data) => {
  const {
    nom, description, date, temps, idProjet,
  } = data;

  const query = `
        INSERT INTO "taches" 
        ("nom_taches", "description_taches", "date_butoire", "temps_prevu_taches", "id_projet", "statut_taches") 
        VALUES ($1, $2, $3, $4, $5, 'A faire')
        RETURNING "id_taches"
    `;

  const result = await db.query(query, [nom, description, date, temps, idProjet]);

  // On renvoie l'ID généré
  return result.rows[0].id_taches || Object.values(result.rows[0])[0];
};

// Mettre à jour une tâche pour le Drag & Drop

// Supprimer une tâche
const deleteTask = async (id) => {
  const query = 'DELETE FROM "taches" WHERE "id_taches" = $1';
  const result = await db.query(query, [id]);
  return result.rowCount;
};

// Créé un lien d'assignation
const assignUserToTask = async (taskId, userId) => {
  const query = 'INSERT INTO "assigner" ("id_taches", "id_utilisateur") VALUES ($1, $2)';
  const result = await db.query(query, [taskId, userId]);
  return result.rowCount;
};

module.exports = {
  getTasksByProject, createTache, updateTask, deleteTask, assignUserToTask,
};
