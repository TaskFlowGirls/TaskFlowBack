const db = require("../../db");

// Récupère tous les projets d'un utilisateur avec les statistiques de tâchespour calculer l'avancement dans le contrôleur.

const getUserProjects = async (userId) => {
    const query = `
        SELECT 
            p.*, 
            COUNT(t.id_taches) AS total_taches,
            SUM(CASE WHEN t.statut_taches = 'Terminé' THEN 1 ELSE 0 END) AS taches_terminees
        FROM projets p
        LEFT JOIN tâches t ON p.id_projet = t.id_projet
        WHERE p.id_utilisateur = ?
        GROUP BY p.id_projet
        ORDER BY p.date_debut_projet DESC
    `;
    const [rows] = await db.query(query, [userId]);
    return rows;
};

// Crée un nouveau projet dans la table 'projets'

const createProjet = async (data) => {
    const { type, nom, description, id_createur } = data;
    
    // Le statut par défaut est 'A faire' comme défini dans ton SQL
    const query = `
        INSERT INTO projets 
        (type_projet, nom_projet, description_projet, id_utilisateur, statut_projet, date_debut_projet) 
        VALUES (?, ?, ?, ?, 'A faire', NOW())
    `;
    
    const [result] = await db.query(query, [type, nom, description, id_createur]);
    
    // Retourne l'ID du projet fraîchement créé
    return result.insertId;
};


// Récupère les détails d'un projet spécifique par son ID

const getProjectById = async (projectId) => {
    const [rows] = await db.query("SELECT * FROM projets WHERE id_projet = ?", [projectId]);
    return rows[0];
};

module.exports = {
    getUserProjects,
    createProjet,
    getProjectById
};