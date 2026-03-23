const User = require('./users.model');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config()

const pepper = process.env.PEPPER;
const jwtKey = process.env.JWT_SECRET;

exports.createUser = async (req, res) => {
    try {
        const hash = bcryptjs.hashSync(req.body.password + pepper, 10);
        const newUser = new User ({
            email: req.body.email,
            password: hash,
            username: req.body.username
        });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}


exports.login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(404).json({ error: "Email ou mot de passe incorrect!" });
    }

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
    } catch (err) {
        console.error("Erreur login:", err.message);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId, '-password -updatedAt')
        if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
        res.status(200).json(user);
    } catch (err) {
        console.error("Erreur:" , err.message);
        res.status(404).json({error: "Erreur interne"});
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
