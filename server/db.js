const mongoose = require('mongoose');

const db = 'mongodb+srv://database-admin:' + process.env.DB_PASSWORD + '@db.e2byc.mongodb.net/auth?retryWrites=true&w=majority';

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.set('useCreateIndex', true)

const con = mongoose.connection;
con.on('error', err => {
    console.log("Error with connect to database: " + err);
});

con.once('open', () => {
    console.log('Database connected');
});