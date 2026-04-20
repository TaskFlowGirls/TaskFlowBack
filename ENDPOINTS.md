# Documentation de l'API TaskFlow

Cette documentation récapitule les endpoints de l'API TaskFlow

## Authentification

| Méthode  | Endpoints            | Description                      | Protection |
| :------- | :------------------- | :------------------------------- | :--------- |
| **POST** | `/api/auth/register` | Création d'un nouveau compte     | Public     |
| **POST** | `/api/auth/login`    | Connexion et récupération du JWT | Public     |

## Projet

| Méthode  | Endpoints                         | Description                             | Protection         |
| :------- | :-------------------------------- | :-------------------------------------- | :----------------- |
| **GET**  | `/api/projets`                    | Liste tous les projets de l'utilisateur | `verifyToken`      |
| **POST** | `/api/projets/`                   | Crée un nouveau projet                  | `verifyToken`      |
| **GET**  | `/api/projets/:projectId/membres` | Liste les membres d'un projet           | `checkProjectRole` |
| **POST** | `/api/projets/:projectId/inviter` | Ajoute un membre au projet              | `checkProjectRole` |

## Tâches

| Méthode    | Endpoints              | Description                             | Protection         |
| :--------- | :--------------------- | :-------------------------------------- | :----------------- |
| **POST**   | `api/taches`           | Crée une nouvelle tâche                 | `checkProjectRole` |
| **GET**    | `api/tache/:projectId` | Liste les tâches d'un projet            | `checkProjectRole` |
| **PUT**    | `api/tache/:id`        | Modifie le statut / contenu d'une tâche | `checkProjectRole` |
| **DELETE** | `/api/tache/:id`       | Supprime une tâche                      | `checkProjectRole` |
