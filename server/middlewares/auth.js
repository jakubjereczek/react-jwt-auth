const jwt = require('jsonwebtoken');
const RefreshToken = require('../models/RefreshToken');

// Wykorzystywane przy innych routach.
function auth(req, res, next) {
    const authHeader = req.headers['authorization'];
    //const refreshToken = req.headers['refresh-token'];
    const userId = req.headers['user_id'];

    const token = authHeader && authHeader.split(' ')[1];

    // access token
    if (!token) {
        return res.status(401).json({
            message: "Authorization error (token is null)"
        })
    }

    jwt.verify(token, process.env.JWT_SECRET_TOKEN, (err, user1) => {
        if (err) {
            // Token wygasl. Sprawdzamy teraz refreshToken, jesli on nie wygasl to generujemy nowy accessToken.
            // POBIERAMY REFRESHTOKEN ZAPISANY W BAZIE DANYCH.
            RefreshToken.findOne({ user: userId }, (err, doc) => {
                const refreshToken = doc.key;

                if (refreshToken === null) {
                    return res.status(401).json({
                        message: "Authorization error (token is invalid and refreshToken is null)",
                    })
                }

                jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET, (err, user2) => {
                    if (!err) {
                        const accessToken = jwt.sign({ _id: userId }, process.env.JWT_SECRET_TOKEN, { expiresIn: 30 });

                        res.set({
                            'authorization': accessToken,
                            'Access-Control-Expose-Headers': 'authorization'
                        })
                        next(); // przejście do własciwej akcji
                    } else {
                        // Jesli REFRESH TOKEN wygasł - to ustawiamy na null oraz odsylamy blad 401.
                        RefreshToken.findOneAndUpdate({ user: userId }, { $set: { key: null } }, { new: true }, (err, res) => {
                            // if (err) return res.status(401);

                            console.log('token updated');
                        })

                        return res.status(401).json({
                            message: "Authorization error (accessToken and RefreshToken are invalid)"
                        })

                    }

                });

            })
        } else {
            // Token się zgadza, przechodzę dalej.
            console.log('PRZECHODE DALEJ!!!');
            next();

            // Debug.
            console.log("Token created: " + new Date(user1.iat * 1000).toUTCString() + "\n expired: " + new Date(user1.exp * 1000).toUTCString());
        }
    })

}


module.exports = auth;