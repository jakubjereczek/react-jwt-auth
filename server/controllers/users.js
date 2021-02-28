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
        return (
            res.status(400).json({
                message: "Field name or password is incorrect"
            })
        )

    }
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (!err) {
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
                        if (!err) {
                            res.status(200).json({
                                message: "Account is created",
                                user: {
                                    name,
                                }
                            })
                        } else {
                            res.status(500).json({
                                message: "User is exist or other error with authorization.",
                                user: {
                                    name,
                                }
                            })
                        }
                    })

                }
            })
        } else {
            res.status(500).json({
                message: "Error with bcrypt",
                user: {
                    name
                }
            })
        }
    });

};

const users_login = (req, res, next) => {
    const { name, password } = req.body;
    const user = {
        name,
        password
    }

    User.findOne({ name }).then((doc) => {

        // gdy uzytkownik istnieje
        bcrypt.compare(password, doc.password, (err, result) => {
            if (!err) {
                if (result) {
                    const accessToken = jwt.sign({ _id: doc._id, name: doc.name }, process.env.JWT_SECRET_TOKEN, { expiresIn: EXPIRED_MINISECOUNDS });
                    const refreshToken = jwt.sign({ _id: doc._id, name: doc.name }, process.env.JWT_REFRESH_TOKEN_SECRET, { expiresIn: EXPIRED_REFRESH_MILISECOUNDS }); // wykorzystywany w momecie gdy glowny token wygaśnie, dzieki temu uzytkonik nie bedzie musiał sie ponownie logować bo wygenerujemy nowy accessToken

                    RefreshToken.findOneAndUpdate({ user: doc._id }, { $set: { key: refreshToken } }, { new: true })
                        .then(doc2 => {
                            console.log(doc2);
                            return (
                                res.status(200).json({
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
                                }))
                        }).catch(() => {
                            return (
                                res.status(404).json({
                                    message: "Authorization error",
                                    user: {
                                        name
                                    }
                                }))
                        });

                } else {
                    // zle haslo
                    return (
                        res.status(404).json({
                            message: "Authorization error",
                            user: {
                                name
                            }
                        }))
                }

            } else {
                res.status(200).json({
                    message: "Authorization error",
                    user: {
                        name
                    }
                })
                next();
            }
        });
    }).catch(err => {
        res.status(404).json({
            message: "Authorization error " + err,
            user,
        })
    })
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
    users_refresh_token,

    users_list
}
