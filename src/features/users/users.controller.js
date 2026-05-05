const User = require('./users.model');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const pepper = process.env.PEPPER;
const jwtKey = process.env.JWT_SECRET;

exports.createUser = async (req, res) => {
    try {
        // Vérifier si l'email existe déjà
        const existingEmail = await User.findOne({ email: req.body.email });
        if (existingEmail) {
            // Si c'est un compte SSO, proposer la connexion SSO
            if (existingEmail.authProvider !== 'local') {
                return res.status(409).json({ 
                    error: `Cet email est déjà utilisé avec ${existingEmail.authProvider.toUpperCase()}. Connectez-vous avec ${existingEmail.authProvider}.`,
                    authProvider: existingEmail.authProvider
                });
            }
            return res.status(409).json({ error: "Cet email est déjà utilisé!" });
        }

        // Vérifier si le username existe déjà
        const existingUsername = await User.findOne({ username: req.body.username });
        if (existingUsername) {
            return res.status(409).json({ error: "Ce nom d'utilisateur est déjà pris!" });
        }

        // Créer le nouvel utilisateur avec password
        const hash = bcryptjs.hashSync(req.body.password + pepper, 10);
        const newUser = new User ({
            email: req.body.email,
            password: hash,
            username: req.body.username,
            authProvider: 'local'
        });
        await newUser.save();
        res.status(201).json({
            message: "Utilisateur créé avec succès ✅",
            user: {
                id: newUser._id,
                email: newUser.email,
                username: newUser.username
            }
        });
        console.log("Utilisateur créé avec succès");
    } catch (err) {
        res.status(400).json({ error: err.message });
        console.log(err.message);
    }
}


exports.login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ error: "Email ou mot de passe incorrect!" });
        }

        // Vérifier si l'utilisateur a un mot de passe (pas un compte SSO)
        if (!user.password) {
            return res.status(403).json({ 
                error: `Ce compte a été créé via ${user.authProvider.toUpperCase()}. Veuillez vous connecter avec ${user.authProvider}.`,
                authProvider: user.authProvider
            });
        }

        // Vérifier le mot de passe si l'utilisateur en a un
        const isValid = bcryptjs.compareSync(req.body.password + pepper, user.password);
        if (!isValid) {
            return res.status(404).json({ error: "Email ou mot de passe incorrect!" });
        }

        const token = jwt.sign(
            { id: user._id },
            jwtKey,    
            { expiresIn: "24h" }
        );

        res.status(200).json({
            message: "Connexion réussie ✅",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            },
            token
        });
        console.log("Utilisateur connecté avec succès"); // for testing
    } catch (err) {
        console.error("Erreur login:", err.message);
        res.status(500).json({ error: "Erreur interne du serveur." });
        console.log(err.message); // for testing
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId, '-password -updatedAt')
        if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
        res.status(200).json(user);
        console.log("Données utilisateur récupérées avec succès"); // for testing
    } catch (err) {
        console.error("Erreur:" , err.message);
        res.status(404).json({error: "Erreur interne"});
        console.log(err.message); // for testing
    }
}

exports.getAllUser = async (req, res) => {
    try {
        const users = await User.find();
        res.status(201).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message});
    }
}

exports.googleCallback = async (req, res) => {
    try {
        const user = req.user;
        
        const token = jwt.sign(
            { id: user._id },
            jwtKey,
            { expiresIn: "24h" }
        );

        // Redirection avec le token au frontend
        // À adapter selon l'URL de votre frontend
        res.redirect(`http://localhost:5173/auth-success?token=${token}&userId=${user._id}&username=${user.username}&email=${user.email}`);
    } catch (err) {
        console.error("Erreur callback Google:", err.message);
        res.status(500).json({ error: "Erreur lors de l'authentification Google" });
    }
}

exports.facebookCallback = async (req, res) => {
    try {
        const user = req.user;
        
        const token = jwt.sign(
            { id: user._id },
            jwtKey,
            { expiresIn: "24h" }
        );

        // Redirection avec le token au frontend
        // À adapter selon l'URL de votre frontend
        res.redirect(`http://localhost:5173/auth-success?token=${token}&userId=${user._id}&username=${user.username}&email=${user.email}`);
    } catch (err) {
        console.error("Erreur callback Facebook:", err.message);
        res.status(500).json({ error: "Erreur lors de l'authentification Facebook" });
    }
}
