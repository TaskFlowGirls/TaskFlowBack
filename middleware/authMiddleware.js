const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  let token = null;

  // Priorité au Cookie
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    // 1. Correction: Utilisation de const pour la destructuring (array destructuring)
    const [, extractedToken] = req.headers.authorization.split(' ');
    token = extractedToken;
  }

  if (!token) {
    return res.status(401).json({ message: 'Accès refusé : Jeton manquant' });
  }

  // Vérification du JWT
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Accès refusé : Jeton invalide ou expiré' });
    }

    // On utilise id_utilisateur pour correspondre à ta base SQL
    const userId = decoded.id || decoded.id_utilisateur;

    if (!userId) {
      return res.status(401).json({ message: 'Jeton corrompu' });
    }

    req.user = { id: userId };
    return next();
  });

  return null;
};

module.exports = { verifyToken };
