const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const users_create = (req, res, next) => {
    const { name, password } = req.body;
    console.log(name, password, room, chatColor)

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
            const user = new User({
                _id: new mongoose.Types.ObjectId,
                // name jest unique - więc nie trzeba sprawdzać czy user istnieje 
                name,
                password: hash,
            })
            user.save(err => {
                console.log(err);
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
                            room,
                            chatColor
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
                    const accessToken = jwt.sign({ _id: doc._id, name: doc.name }, process.env.JWT_SECRET_TOKEN, { expiresIn: 86400 });
                    const refreshToken = jwt.sign({ _id: doc._id, name: doc.name }, process.env.JWT_REFRESH_TOKEN_SECRET, { expiresIn: 525600 }); // wykorzystywany w momecie gdy glowny token wygaśnie, dzieki temu uzytkonik nie bedzie musiał sie ponownie logować bo wygenerujemy nowy accessToken

                    return (
                        res.status(200).json({
                            message: "User log in",
                            user: {
                                _id: doc._id,
                                name: doc.name,
                                room: doc.room,
                                chatColor: doc.chatColor
                            },
                            tokens: {
                                accessToken,
                                refreshToken
                            }
                        }))

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

// odswiezanie tokenu na podstawie refresh tokenu
const users_refresh_token = (req, res, next) => {
    const { refreshToken } = req.body;

    if (!refreshToken)
        return res.status(401).json({
            message: "Authorization error (refresh token is null)",
        })
    // to do: refresh tokeny warto trzymać w bazie danych
    try {
        jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET)
        // generowanie nowego access tokenu
        const accessToken = jwt.sign({ _id: doc._id, name: doc.name }, process.env.JWT_SECRET_TOKEN, { expiresIn: 86400 });

        res.status(200).json({
            message: "Token refreshed",
            tokens: {
                accessToken,
            }
        })
    } catch {
        return res.status(401).json({
            message: "Authorization error (token is invalid)",
        })
    }

};


module.exports = {
    users_create,
    users_login,
    users_refresh_token
}