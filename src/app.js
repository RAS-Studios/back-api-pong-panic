const express = require('express');
const userRoute = require('./features/users/users.route');
const matchRoute = require('./features/matches/matches.route')
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/passport');

const path = require("path");
const app = express();

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', // ton frontend en dev
    credentials: true
}));

// Configuration de la session
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production', 
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24h
    }
}));

// Initialisation de Passport
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/users', userRoute);
app.use('/api/matches', matchRoute);

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

module.exports = app;

