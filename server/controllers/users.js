const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');

const EXPIRED_MINISECOUNDS = 30; // 30 secounds
const EXPIRED_REFRESH_MILISECOUNDS = 60 * 2; // 120 s.

const users_create = (req, res, next) => {

    const { name, password } = req.body;

    if (!name || !password) {
        const error = new Error("Field name or password is incorrect")
        error.statusCode = 400;
        next(error);
    }
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) next(err);
        const userModel = new User({
            _id: new mongoose.Types.ObjectId,
            // name jest unique - więc nie trzeba sprawdzać czy user istnieje 
            name,
            password: hash,
        })
        userModel.save(err => {
            console.log(err);
            if (!err) {
                // Utworzenie klucza refreshKey w bazie - na razie pusty. Podczas logowania zostania wygenerowany.
                const refreshToken = new RefreshToken({
                    user: userModel._id,
                    key: null,
                })
                refreshToken.save(err => {
                    if (err) next(err);
                    res.status(200).json({
                        message: "Account is created",
                        user: {
                            name,
                        }
                    })
                })

            }

        })
    });


};

const users_login = (req, res, next) => {
    const { name, password } = req.body;

    User.findOne({ name }).then((doc) => {

        if (!doc) {
            const error = new Error("Field name or password is empty")
            error.statusCode = 404;
            next(error)
        }

        console.log('2. User znaleziony', doc.name);


        // gdy uzytkownik istnieje
        bcrypt.compare(password, doc.password, (err, result) => {
            if (err) next(err);

            if (result) {
                const accessToken = jwt.sign({ _id: doc._id, name: doc.name }, process.env.JWT_SECRET_TOKEN, { expiresIn: EXPIRED_MINISECOUNDS });
                const refreshToken = jwt.sign({ _id: doc._id, name: doc.name }, process.env.JWT_REFRESH_TOKEN_SECRET, { expiresIn: EXPIRED_REFRESH_MILISECOUNDS }); // wykorzystywany w momecie gdy glowny token wygaśnie, dzieki temu uzytkonik nie bedzie musiał sie ponownie logować bo wygenerujemy nowy accessToken

                RefreshToken.findOneAndUpdate({ user: doc._id }, { $set: { key: refreshToken } }, { new: true })
                    .then(doc2 => {
                        res.status(200);
                        return res.status(200).json({
                            message: "User log in",
                            user: {
                                _id: doc._id,
                                name: doc.name,
                            },
                            tokens: {
                                accessToken,
                                // refreshToken
                                // Refresh tokenu juz nie przekazujemy a trzymamy w db.
                            }
                        })
                    }).catch(err => next(err));

            } else {
                // zle haslo
                const error = new Error("Authorization error")
                error.statusCode = 404;
                next(error);
            }

        });
    }).catch(err => next(err));
}

const users_list = (req, res, next) => {
    res.status(200).json({
        users: [
            { id: 1, name: "Jakub" },
            { id: 2, name: "Rafał" }
        ]
    })
}


module.exports = {
    users_create,
    users_login,
    users_list
}
