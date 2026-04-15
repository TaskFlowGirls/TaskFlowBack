const ProjetModel = require("../models/ProjetsModel");
const db = require("../../db");

const getDashboard = async (req, res) => {
    try {
        const userId = req.user.id;
        const projets = await ProjetModel.getUserProjects(userId);

        const projetsAvecStats = projets.map(p => {
            // Postgres renvoie les agrégats (COUNT/SUM) en String, on les convertit
            const total = parseInt(p.total_taches) || 0;
            const terminees = parseInt(p.taches_terminees) || 0;
            const avancement = total > 0 ? Math.round((terminees / total) * 100) : 0;
            
            return {
                ...p,
                pourcentage_avancement: avancement
            };
        });

        res.json(projetsAvecStats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la récupération des projets" });
    }
};

const addProjet = async (req, res) => {
    try {
        const { type_projet, nom_projet, description_projet } = req.body;
        const userId = req.user.id;

        const id_projet = await ProjetModel.createProjet({
            type: type_projet,
            nom: nom_projet,
            description: description_projet,
            id_createur: userId
        });

        // Debug pour voir exactement ce que le modèle renvoie au contrôleur
        console.log("ID récupéré par le controller :", id_projet);

        // Liaison automatique : le créateur devient Chef de projet
        const queryLiaison = `
            INSERT INTO "participer" ("id_utilisateur", "id_projet", "role_utilisateur") 
            VALUES ($1, $2, $3)
        `;
        await db.query(queryLiaison, [userId, id_projet, 'Chef de projet']);

        res.status(201).json({ 
            message: "Projet créé et créateur assigné !", 
            id_projet 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur création projet" });
    }
};

const inviteMember = async (req, res) => {
    try {
        const { email, id_projet, role_utilisateur } = req.body;

        const result = await db.query('SELECT "id_utilisateur" FROM "utilisateurs" WHERE "adresse_mail" = $1', [email]);
        const user = result.rows[0];
        
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé avec cet email." });
        }

        const targetUserId = user.id_utilisateur;

        const existing = await db.query(
            'SELECT * FROM "participer" WHERE "id_utilisateur" = $1 AND "id_projet" = $2', 
            [targetUserId, id_projet]
        );

        if (existing.rows.length > 0) {
            return res.status(400).json({ message: "Cet utilisateur participe déjà au projet." });
        }

        const query = `
            INSERT INTO "participer" ("id_utilisateur", "id_projet", "role_utilisateur") 
            VALUES ($1, $2, $3)
        `;
        await db.query(query, [targetUserId, id_projet, role_utilisateur || 'Collaborateur']);

        res.status(201).json({ message: "Utilisateur invité avec succès !" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'invitation", error: error.message });
    }
};

const getProjectMembers = async (req, res) => {
    try {
        const projectId = req.params.id_projet || req.params.projectId || req.params.id;
        const cleanId = parseInt(projectId);

        if (isNaN(cleanId)) return res.status(400).json({ message: "ID de projet invalide" });

        const query = `
            SELECT u.id_utilisateur, u.prenom, u.nom, u.adresse_mail, p.role_utilisateur
            FROM "utilisateurs" u
            INNER JOIN "participer" p ON u.id_utilisateur = p.id_utilisateur
            WHERE p.id_projet = $1
        `;

        const result = await db.query(query, [cleanId]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

const updateMemberRole = async (req, res) => {
    try {
        const { id_projet, id_utilisateur, nouveau_role } = req.body;
        const query = `
            UPDATE "participer" SET "role_utilisateur" = $1 
            WHERE "id_utilisateur" = $2 AND "id_projet" = $3
        `;
        await db.query(query, [nouveau_role, id_utilisateur, id_projet]);
        res.json({ message: "Rôle mis à jour !" });
    } catch (error) {
        res.status(500).json({ message: "Erreur changement rôle" });
    }
};

const removeMember = async (req, res) => {
    try {
        const { id_projet, id_utilisateur } = req.params;
        const query = `
            DELETE FROM "participer" 
            WHERE "id_utilisateur" = $1 AND "id_projet" = $2
        `;
        await db.query(query, [id_utilisateur, id_projet]);
        res.json({ message: "Utilisateur retiré du projet." });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression" });
    }
};

const addMemberToProject = async (req, res) => {
    try {
        const { id_utilisateur, id_projet, role_utilisateur } = req.body;

        const existing = await db.query(
            'SELECT * FROM "participer" WHERE "id_utilisateur" = $1 AND "id_projet" = $2', 
            [id_utilisateur, id_projet]
        );

        if (existing.rows.length > 0) {
            return res.status(400).json({ message: "Cet utilisateur est déjà dans le projet." });
        }

        const query = `
            INSERT INTO "participer" ("id_utilisateur", "id_projet", "role_utilisateur") 
            VALUES ($1, $2, $3)
        `;
        await db.query(query, [id_utilisateur, id_projet, role_utilisateur || 'Collaborateur']);

        res.status(201).json({ message: "Utilisateur ajouté au projet avec succès !" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'ajout du membre", error: error.message });
    }
};

module.exports = { 
    getDashboard, 
    addProjet, 
    inviteMember, 
    getProjectMembers, 
    updateMemberRole, 
    removeMember,
    addMemberToProject
};