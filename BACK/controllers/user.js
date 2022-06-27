const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
var mysqlConf = require('../mysql.js').mysql_pool;
var EmailValidator = require("email-validator");
require('dotenv').config();
exports.signup = (req, res, next) => {
    UserName = req.body.username;
    Password = req.body.password;
    Mail = req.body.mail;
    var RegexName = /^[a-zA-Z]+$/;
    //verifier l'adresse mail
    if (!EmailValidator.validate(Mail)) {
        return res.status(400).json({ error: "L'adresse mail n'est pas valide" });
    }
    //verifier le nom
    if (!RegexName.test(UserName)) {
        return res.status(400).json({ error: "Le pseudo n'est pas valide" });
    }
    //verifier le mot de passe
    if (Password.length < 8 || Password.length > 20 || !/\d/.test(Password) || !/[a-z]/.test(Password) || !/[A-Z]/.test(Password) || !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(Password) || !/[0-9]/.test(Password)) {
        return res.status(400).json({ error: "Le mot de passe n'est pas assez compliqué" });
    }
    //verifier si l'adresse mail existe
    mysqlConf.query("SELECT * FROM users WHERE mail = ?", [Mail], function (error, results, fields) {
        if (error) {
            return res.status(500).json({ error: error });
        }
        if (results.length > 0) {
            return res.status(400).json({ error: "L'adresse mail existe déjà" });
        }
        //verifier si le nom existe
        mysqlConf.query("SELECT * FROM users WHERE username = ?", [UserName], function (error, results, fields) {
            if (error) {
                return res.status(500).json({ error: error });
            }
            if (results.length > 0) {
                return res.status(400).json({ error: "Le pseudo existe déjà" });
            }
            //hash le mot de passe
            bcrypt.hash(Password, 10, function (err, hash) {
                if (err) {
                    return res.status(500).json({ error: err });
                }
                //inserer dans la base de donnée
                mysqlConf.query("INSERT INTO users (username, password, mail) VALUES (?, ?, ?)", [UserName, hash, Mail], function (error, results, fields) {
                    if (error) {
                        return res.status(500).json({ error: error });
                    }
                    return res.status(201).json({ message: "Compte crée" });
                });
            });
        });
    });
};

exports.login = async (req, res, next) => {
    const mail = req.body.mail;
    const Password = req.body.password;
    //verifier l'adresse mail
    if (!EmailValidator.validate(mail)) {
        return res.status(400).json({ error: "L'adresse mail n'est pas valide" });
    }
    //verifier le mot de passe
    if (Password.length < 8 || Password.length > 20 || !/\d/.test(Password) || !/[a-z]/.test(Password) || !/[A-Z]/.test(Password) || !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(Password) || !/[0-9]/.test(Password)) {
        return res.status(400).json({ error: "Le mot de passe n'est pas assez compliqué" });
    }
    mysqlConf.query("SELECT * FROM users WHERE mail = ?", [mail], function (error, results, fields) {
        if (error) {
            return res.status(500).json({ error: error });
        }
        if (results.length == 0) {
            return res.status(404).json({ error: "L'adresse mail n'existe pas" });
        }
        bcrypt.compare(Password, results[0].password, function (err, result) {
            if (err) {
                return res.status(401).json({ error: "Mot de passe incorrect" });
            }
            if (result) {
                const token = jwt.sign({
                    username: results[0].username,
                    userId: results[0].id,
                    rank: results[0].rank
                },
                    process.env.JWT_SECRET,
                    { expiresIn: "24h" }
                );
                return res.status(200).json({
                    message: "Auth successful",
                    token: token
                });
            }
            return res.status(401).json({ error: "Mot de passe incorrect" });
        });
    });
};

exports.userInfos = (req, res, next) => {
    mysqlConf.query("SELECT * FROM users WHERE id = ?", [req.auth.userId], function (error, results, fields) {
        if (error) {
            return res.status(500).json({ error: error });
        }
        return res.status(200).json({
            username: results[0].username,
            mail: results[0].mail,
            rank: results[0].rank
        });
    });

};