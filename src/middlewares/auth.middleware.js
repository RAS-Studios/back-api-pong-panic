require('dotenv').config()
const jwt = require('jsonwebtoken')
const auth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ error: "Token manquant" });

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;  // on garde juste l'id
        next();
    } catch (e) {
        console.error("Erreur JWT:", e.message);
        res.status(401).json({ error: "Vous devez être authentifié pour réaliser cela." });
    }
};
module.exports = auth;
