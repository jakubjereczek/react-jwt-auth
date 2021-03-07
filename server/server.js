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

// routes unavailable
app.get('*', function (req, res, next) {
    const err = new Error(`${req.ip} tried to connect ${req.originalUrl}`)
    err.statusCode = 301;
    next(err);
})

// errors handlers in routes
app.use((err, req, res, next) => {

    console.log(err.statusCode);
    if (!err.statusCode) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: err.toString()
        })
    } else if (err.statusCode === 301) {
        // Redirect 
    }

    // Otherss 
    return res.status(err.statusCode).json({
        message: "Error " + err.statusCode,
        error: err.toString()
    })
})

server.listen(port, "127.0.0.1", () => {
    console.log(`Server is listening at http://127.0.0.1:${port}`)
});