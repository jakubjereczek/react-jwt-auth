const jwt = require('jsonwebtoken');

// Wykorzystywane przy innych routach.
function auth(req, res, next) {
    const authHeader = req.headers['authorization'];
    const refreshToken = req.headers['refresh-token'];
    const user = req.headers['user'];

    const token = authHeader && authHeader.split(' ')[1];

    if (token === null)
        return res.status(401).json({
            message: "Authorization error (token is null)",
        })

    jwt.verify(token, process.env.JWT_SECRET_TOKEN, (err, user1) => {
        if (err) {
            // Token wygasl. Sprawdzamy teraz refreshToken, jesli on nie wygasl to generujemy nowy accessToken.
            if (refreshToken !== undefined) {
                jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET, (err, user2) => {
                    if (!err) {
                        // todo: Zapisywanie refreshTokenów powinno odbywać się w bazie danych. Poczytac o tym.
                        const accessToken = jwt.sign({ _id: user._id, name: user.name }, process.env.JWT_SECRET_TOKEN, { expiresIn: 30 });

                        res.set({
                            'authorization': accessToken,
                            'refresh-token': refreshToken, // ten sam
                            'Access-Control-Expose-Headers': 'authorization, refresh-token'
                        })
                        next(); // przejście do własciwej akcji
                    } else {
                        return res.status(401).json({
                            message: "Authorization error (accessToken and RefreshToken are invalid)",
                        })
                    }

                });
            } else {
                return res.status(401).json({
                    message: "Authorization error (token is invalid and refreshToken is null)",
                })
            }
        } else {
            next();

            // debug
            console.log("Token created: " + new Date(user1.iat * 1000).toLocaleDateString() + " expired: " + new Date(user1.exp * 1000).toLocaleDateString());
        }
    })

}




module.exports = auth;