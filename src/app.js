const express = require('express');
const userRoute = require('./features/users/users.route');
const matchRoute = require('./features/matches/matches.route')
const cors = require('cors');

require('dotenv').config();
const path = require("path");
const app = express();

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', // ton frontend en dev
    credentials: true
}));

app.use('/api/users', userRoute);
app.use('/api/matches', matchRoute);

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

module.exports = app;

