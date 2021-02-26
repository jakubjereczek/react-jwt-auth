const jwt = require('jsonwebtoken');

// Wykorzystywane przy innych routach.
function authoricate(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token === null)
        return res.status(401).json({
            message: "Authorization error (token is null)",
        })

    jwt.verify(token, process.env.JWT_SECRET_TOKEN, (err, user) => {
        if (err)
            return res.status(401).json({
                message: "Authorization error (token is invalid)",
            })
        req.user = user;
        next();
    })

}



module.exports = authoricate;