const app = require('./app');
const http = require('http');
require('dotenv').config();
const connectDB = require('./config/db');

const server = http.createServer(app);

const PORT = 3000

connectDB();

server.on('listening', () => {
    console.log("Server listen on port : " + PORT);
});

server.listen(PORT);