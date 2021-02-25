const express = require('express');
const app = express();
const port = process.env.port || 80;

const server = require('http').createServer(app);

const bodyParser = require('body-parser')
const cors = require('cors')

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // For legacy browser support
}

// middlewares
app.use(bodyParser.json())

// middlewares
app.use(bodyParser.json())
app.use(cors(corsOptions));


server.listen(port, "127.0.0.1", () => {
    console.log(`Server is listening at http://127.0.0.1:${port}`)
});