const express = require('express');
const app = express();
const port = process.env.port || 80;

const server = require('http').createServer(app);
const db = require('./db');

const bodyParser = require('body-parser')
const cors = require('cors')

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // For legacy browser support
}

const UsersRoute = require('./routes/users');

// middlewares
app.use(bodyParser.json())
app.use(cors(corsOptions));

// routes
app.use('/users', UsersRoute)

server.listen(port, "127.0.0.1", () => {
    console.log(`Server is listening at http://127.0.0.1:${port}`)
});