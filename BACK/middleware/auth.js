const jwt = require('jsonwebtoken')
require('dotenv').config();

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.userId;
        const rank = decodedToken.rank;
        req.auth = { userId: userId, rank: rank };
        // console.log(userId + " | " + req.body.userId);
        if (req.body.userId && req.body.userId !== userId) {
            throw 'User ID non valable';
        } else {
            //Vérifiez le userid quand il y a une image !
            next();
        }
    } catch (error) {
        res.status(401).json({ error: 'Requête non authentifiée' });
    }
}