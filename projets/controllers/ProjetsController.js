const ProjetModel = require('../models/ProjetsModel');
const db = require('../../db');

// La vue d'ensemble
const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const projets = await ProjetModel.getUserProjects(userId);

    const projetsAvecStats = projets.map((p) => {
      const total = parseInt(p.totalTaches, 10) || 0;
      const terminees = parseInt(p.tachesTerminees, 10) || 0;
      const avancement = total > 0 ? Math.round((terminees / total) * 100) : 0;

      return {
        ...p,
        pourcentage_avancement: avancement,
      };
    });

    return res.json(projetsAvecStats);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur lors de la récupération des projets' });
  }
};

const addProjet = async (req, res) => {
  try {
    const { typeProjet, nomProjet, descriptionProjet } = req.body;
    const userId = req.user.id;

    const idProjet = await ProjetModel.createProjet({
      type: typeProjet,
      nom: nomProjet,
      description: descriptionProjet,
      idCreateur: userId,
    });

    // Debug pour voir exactement ce que le modèle renvoie au contrôleur
    console.log('ID récupéré par le controller :', idProjet);

    const queryLiaison = `
            INSERT INTO "participer" ("id_utilisateur", "id_projet", "role_utilisateur") 
            VALUES ($1, $2, $3)
        `;
    await db.query(queryLiaison, [userId, idProjet, 'Chef de projet']);

    return res.status(201).json({
      message: 'Projet créé et créateur assigné !',
      idProjet,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur création projet' });
  }
};

const inviteMember = async (req, res) => {
  try {
    const { email, idProjet, roleUtilisateur } = req.body;

    const result = await db.query('SELECT "id_utilisateur" FROM "utilisateurs" WHERE "adresse_mail" = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé avec cet email.' });
    }

    const targetUserId = user.id_utilisateur;

    const existing = await db.query(
      'SELECT * FROM "participer" WHERE "id_utilisateur" = $1 AND "id_projet" = $2',
      [targetUserId, idProjet],
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Cet utilisateur participe déjà au projet.' });
    }

    const query = `
            INSERT INTO "participer" ("id_utilisateur", "id_projet", "role_utilisateur") 
            VALUES ($1, $2, $3)
        `;
    await db.query(query, [targetUserId, idProjet, roleUtilisateur || 'Collaborateur']);

    return res.status(201).json({ message: 'Utilisateur invité avec succès !' });
  } catch (error) {
    return res.status(500).json({ message: "Erreur lors de l'invitation", error: error.message });
  }
};

const getProjectMembers = async (req, res) => {
  try {
    const projectId = req.params.id_projet || req.params.projectId || req.params.id;
    const cleanId = parseInt(projectId, 10);

    if (Number.isNaN(Number(cleanId))) {
      return res.status(400).json({ message: 'ID de projet invalide' });
    }
    const query = `
            SELECT u.id_utilisateur, u.prenom, u.nom, u.adresse_mail, p.role_utilisateur
            FROM "utilisateurs" u
            INNER JOIN "participer" p ON u.id_utilisateur = p.id_utilisateur
            WHERE p.id_projet = $1
        `;

    const result = await db.query(query, [cleanId]);
    return res.json(result.rows);
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

const updateMemberRole = async (req, res) => {
  try {
    const { idProjet, idUtilisateur, nouveauRole } = req.body;
    const query = `
            UPDATE "participer" SET "role_utilisateur" = $1 
            WHERE "id_utilisateur" = $2 AND "id_projet" = $3
        `;
    await db.query(query, [nouveauRole, idUtilisateur, idProjet]);
    return res.json({ message: 'Rôle mis à jour !' });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur changement rôle' });
  }
};

// Expulse l'utilisateur du projet
const removeMember = async (req, res) => {
  try {
    const { idProjet, idUtilisateur } = req.params;
    const query = `
            DELETE FROM "participer" 
            WHERE "id_utilisateur" = $1 AND "id_projet" = $2
        `;
    await db.query(query, [idUtilisateur, idProjet]);
    return res.json({ message: 'Utilisateur retiré du projet.' });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de la suppression' });
  }
};

// Inviter un utilisateur avec son ID
const addMemberToProject = async (req, res) => {
  try {
    const { idUtilisateur, idProjet, roleUtilisateur } = req.body;

    const existing = await db.query(
      'SELECT * FROM "participer" WHERE "id_utilisateur" = $1 AND "id_projet" = $2',
      [idUtilisateur, idProjet],
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Cet utilisateur est déjà dans le projet.' });
    }

    const query = `
            INSERT INTO "participer" ("id_utilisateur", "id_projet", "role_utilisateur") 
            VALUES ($1, $2, $3)
        `;
    await db.query(query, [idUtilisateur, idProjet, roleUtilisateur || 'Collaborateur']);

    return res.status(201).json({ message: 'Utilisateur ajouté au projet avec succès !' });
  } catch (error) {
    return res.status(500).json({ message: "Erreur lors de l'ajout du membre", error: error.message });
  }
};

module.exports = {
  getDashboard,
  addProjet,
  inviteMember,
  getProjectMembers,
  updateMemberRole,
  removeMember,
  addMemberToProject,
};
