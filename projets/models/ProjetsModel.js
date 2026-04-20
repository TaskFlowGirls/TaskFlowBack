const db = require('../../db');

// Récupère tous les projets d'un utilisateur avec les statistiques de tâches
const getUserProjects = async (userId) => {
  const query = `
        SELECT 
            p.id_projet,
            p.nom_projet,
            p.description_projet,
            p.type_projet,
            p.statut_projet,
            p.date_debut_projet,
            COUNT(t.id_taches) AS total_taches,
            SUM(CASE WHEN t.statut_taches = 'Terminé' THEN 1 ELSE 0 END) AS taches_terminees
        FROM "projets" p
        LEFT JOIN "taches" t ON p.id_projet = t.id_projet
        WHERE p.id_utilisateur = $1
        GROUP BY 
            p.id_projet, 
            p.nom_projet, 
            p.description_projet, 
            p.type_projet, 
            p.statut_projet, 
            p.date_debut_projet
        ORDER BY p.date_debut_projet DESC
    `;

  const result = await db.query(query, [userId]);
  return result.rows;
};

// Crée un nouveau projet
const createProjet = async (data) => {
  const {
    type, nom, description, idCreateur,
  } = data;

  const query = `
        INSERT INTO "projets" 
        ("type_projet", "nom_projet", "description_projet", "id_utilisateur", "statut_projet", "date_debut_projet") 
        VALUES ($1, $2, $3, $4, 'A faire', NOW())
        RETURNING "id_projet"
    `;

  const result = await db.query(query, [type, nom, description, idCreateur]);

  // On vérifie ce qu'il y a dans le premier résultat
  if (result.rows && result.rows.length > 0) {
    // On récupère la valeur de la première colonne de la première ligne
    return result.rows[0].id_projet || Object.values(result.rows[0])[0];
  }

  return null;
};

// Récupère les détails d'un projet spécifique
const getProjectById = async (projectId) => {
  const query = 'SELECT * FROM "projets" WHERE "id_projet" = $1';
  const result = await db.query(query, [projectId]);
  return result.rows[0];
};

module.exports = {
  getUserProjects,
  createProjet,
  getProjectById,
};
