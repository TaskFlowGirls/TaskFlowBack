const db = require("../db");

const checkProjectRole = (rolesAutorises) => {
    return async (req, res, next) => {
        try {
            console.log("=== VÉRIFICATION RÔLE V8 ===");

            // 1. On sécurise les entrées
            const userId = req.user ? req.user.id : null;
            const taskId = req.params ? req.params.id : null;
            
            // On récupère le projectId de manière ultra-sécurisée
            let projectId = null;
            if (req.params && req.params.projectId) projectId = req.params.projectId;
            else if (req.params && req.params.id_projet) projectId = req.params.id_projet;
            else if (req.body && req.body.id_projet) projectId = req.body.id_projet;

            console.log(`Debug : User=${userId}, Task=${taskId}, Project=${projectId}`);

            // 2. Si on n'a pas de projet mais qu'on a une tâche, on cherche en base
            if (!projectId && taskId) {
                console.log("Recherche en base pour la tâche:", taskId);
                const result = await db.query('SELECT id_projet FROM "taches" WHERE id_taches = $1', [taskId]);
                
                // C'est ici que ça crashait sûrement : on blinde l'accès
                if (result && result.rows && result.rows.length > 0 && result.rows[0]) {
                    projectId = result.rows[0].id_projet;
                    console.log("Projet trouvé :", projectId);
                } else {
                    return res.status(404).json({ message: "La tâche n'existe pas ou n'est liée à aucun projet." });
                }
            }

            // 3. Si après ça on n'a toujours rien, on arrête proprement
            if (!projectId) {
                return res.status(400).json({ message: "Impossible d'identifier le projet." });
            }

            // 4. Vérification finale du rôle
            const roleCheck = await db.query(
                'SELECT role_utilisateur FROM "participer" WHERE id_utilisateur = $1 AND id_projet = $2',
                [userId, projectId]
            );

            const foundRole = (roleCheck && roleCheck.rows && roleCheck.rows.length > 0) 
                ? roleCheck.rows[0].role_utilisateur 
                : null;

            if (foundRole && rolesAutorises.includes(foundRole)) {
                console.log("✅ ACCÈS VALIDÉ");
                return next();
            }

            return res.status(403).json({ message: "Accès refusé : rôle insuffisant ou non membre." });

        } catch (error) {
            console.error("ERREUR DANS LE MIDDLEWARE :", error.message);
            return res.status(500).json({ 
                message: "Erreur technique lors de la vérification du rôle",
                details: error.message 
            });
        }
    };
};

module.exports = { checkProjectRole };