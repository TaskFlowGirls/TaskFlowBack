const db = require('../../db');

// Récupérer toutes les tâches d'un projet spécifique pour le Kanban
const getTasksByProject = async (projectId) => {
  const query = 'SELECT * FROM "taches" WHERE "id_projet" = $1 ORDER BY "date_butoire" ASC';
  const result = await db.query(query, [projectId]);
  return result.rows;
};

// Dans TachesModel.js
const updateTask = async (id, data) => {
    // 1. Ajoute "date_fin_taches" ici dans le SET
    const query = `
        UPDATE "taches" 
        SET "statut_taches" = $1, 
            "temps_reel_taches" = $2,
            "date_fin_taches" = $3 
        WHERE "id_taches" = $4
    `;
    
    // 2. Vérifie bien que tu passes data.date_fin_taches ici
    return await db.query(query, [
        data.statut_taches, 
        data.temps_reel_taches, 
        data.date_fin_taches, 
        id
    ]);
};

// Créer une tâche
const createTache = async (data) => {
  const { nom, description, date_butoire, date_debut, date_fin, temps, idProjet } = data;

  // 1. Ajoute "date_debut_taches" et "date_fin_taches" ici
  const query = `
    INSERT INTO "taches" 
    ("nom_taches", "description_taches", "date_butoire", "date_debut_taches", "date_fin_taches", "temps_prevu_taches", "id_projet", "statut_taches") 
    VALUES ($1, $2, $3, $4, $5, $6, $7, 'A faire')
    RETURNING "id_taches"
  `;

  // 2. Assure-toi que le tableau contient bien les valeurs dans le même ordre
  const result = await db.query(query, [
    nom, 
    description, 
    date_butoire, 
    date_debut, 
    date_fin, 
    temps, 
    idProjet
  ]);
  
  return result.rows[0].id_taches;
};

// Mettre à jour une tâche pour le Drag & Drop

// Supprimer une tâche
const deleteTask = async (id) => {
  // Ton SQL dans TachesModel.js
const query = `
    INSERT INTO "taches" 
    ("nom_taches", "description_taches", "date_butoire", "temps_prevu_taches", "id_projet", "statut_taches") 
    VALUES ($1, $2, $3, $4, $5, 'A faire')
    RETURNING "id_taches"
`;

// Vérifie que l'ordre des paramètres correspond EXACTEMENT au $1, $2, etc.
const result = await db.query(query, [
    nom,                // $1
    description,        // $2
    date_butoire,       // $3
    temps,              // $4
    idProjet,           // $5
]);
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
