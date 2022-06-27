const bcrypt = require("bcrypt")
const moment = require("moment");
const jwt = require('jsonwebtoken');
var mysqlConf = require('../mysql.js').mysql_pool;
var EmailValidator = require("email-validator");
require('dotenv').config();
const currentDate = new Date();
const timestamp = currentDate.getTime();
exports.getAll = (req, res, next) => {
    //récuperer tous les posts
    mysqlConf.query("SELECT posts.*, COALESCE(likes.user_id, 0) as liked, users.username FROM posts LEFT JOIN likes ON likes.post_id = posts.id AND likes.user_id = " + req.auth.userId + " LEFT JOIN users ON posts.by = users.id ORDER BY `posts`.`date` DESC", function (error, results, fields) {
        if (error) {
            return res.status(500).json({ error: error });
        }
        return res.status(200).json(results);
    });
};

exports.getOne = (req, res, next) => {
    //récuperer un post
    mysqlConf.query("SELECT posts.*, COALESCE(likes.user_id, 0) as liked, users.username FROM posts LEFT JOIN likes ON likes.post_id = posts.id LEFT JOIN users ON posts.by = users.id WHERE posts.id = ?", [req.params.id], function (error, results, fields) {
        if (error) {
            return res.status(500).json({ error: error });
        }
        if (results.length == 0) {
            return res.status(404).json({ error: "Post non trouvé" });
        }
        return res.status(200).json(results[0]);
    });
}

exports.create = (req, res, next) => {
    //vérifier si req.body.content n'est pas vide
    if (req.body.content === undefined || req.body.content === "" || req.body.content.trim() === "") {
        return res.status(400).json({ error: "Un contenu est requis" });
    }
    //verifier si req.body.content est entre 1 et 280 caractères maximum
    if (req.body.content.length > 280 || req.body.content.length < 1) {
        return res.status(400).json({ error: "Le contenu doit avoir entre 1 et 280 caractères" });
    }
    //limit 1 post per minute en base de données
    mysqlConf.query("SELECT * FROM posts WHERE `by` = ? AND `date` > ?", [req.auth.userId, moment().unix() - 10], function (error, results, fields) {
        if (error) {
            return res.status(500).json({ error: error });
        }
        if (results.length > 0) {
            return res.status(400).json({ error: "Tu peux poster une seule fois toutes les 10sec" });
        }
        let imageUrl = "";
        if (req.file) {
            imageUrl = `${req.file.filename}`;
        }
        mysqlConf.query("INSERT INTO `posts` (`by`, `content`, `date`, `image`) VALUES (?, ?, ?, ?);", [req.auth.userId, req.body.content, moment().unix(), imageUrl], function (error, results, fields) {
            if (error) {
                return res.status(500).json({ error: error });
            }
            //return id of le last post of the user
            mysqlConf.query("SELECT id FROM posts WHERE `by` = ? ORDER BY `posts`.`date` DESC LIMIT 1", [req.auth.userId], function (error, results, fields) {
                if (error) {
                    return res.status(500).json({ error: error });
                }
                return res.status(201).json(results[0]);
            });
        });

    });
}

exports.editOne = (req, res, next) => {
    if (req.body.content === undefined || req.body.content === "" || req.body.content.trim() === "") {
        return res.status(400).json({ error: "Le contenu est requis" });
    }
    if (req.body.content.length > 280 || req.body.content.length < 1) {
        return res.status(400).json({ error: "Le contenu doit avoir entre 1 et 280 caractères" });
    }
    //veirifier si celui qui edit le post est le même que celui qui a posté en base de données
    mysqlConf.query("SELECT * FROM posts WHERE id = ?", [req.params.id], function (error, results, fields) {
        if (error) {
            return res.status(500).json({ error: error });
        }
        if (results.length == 0) {
            return res.status(404).json({ error: "Post non trouvé" });
        }
        if (results[0].by !== req.auth.userId && req.auth.rank !== 1) {
            return res.status(401).json({ error: "Tu n'es pas autorisé à modifier ce post" });
        } else {
            let imageUrl = results[0].image;
            if (req.file) {
                imageUrl = `${req.file.filename}`;
            }
            mysqlConf.query("UPDATE posts SET content = ?, modified = 1, image = ? WHERE id = ?", [req.body.content, imageUrl, req.params.id], function (error, results, fields) {
                if (error) {
                    return res.status(500).json({ error: error });
                }
                return res.status(200).json({ message: "Post mit à jour" });
            });
        }
    });
}

exports.deleteOne = (req, res, next) => {
    mysqlConf.query("SELECT * FROM posts WHERE id = ?", [req.params.id], function (error, results, fields) {
        if (error) {
            return res.status(500).json({ error: error });
        }
        if (results.length == 0) {
            return res.status(404).json({ error: "Post non trouvé" });
        }
        if (results[0].by !== req.auth.userId && req.auth.rank !== 1) {
            return res.status(401).json({ error: "Tu n'es pas autorisé à supprimer ce post" });
            //ERREUR ICI
        } else {
            mysqlConf.query("DELETE FROM posts WHERE id = ?", [req.params.id], function (error, results, fields) {
                if (error) {
                    return res.status(500).json({ error: error });
                }
                //delete alls comments of the post
                mysqlConf.query("DELETE FROM comments WHERE post_id = ?", [req.params.id], function (error, results, fields) {
                    if (error) {
                        return res.status(500).json({ error: error });
                    }
                });
                return res.status(200).json({ message: "Post supprimé" });
            });
        }
    });
}

exports.like = (req, res, next) => {
    mysqlConf.query("SELECT * FROM posts WHERE id = ?", [req.params.id], function (error, results, fields) {
        if (error) {
            return res.status(500).json({ error: error });
        }
        if (results.length == 0) {
            return res.status(404).json({ error: "Post non trouvé" });
        }
        mysqlConf.query("SELECT * FROM likes WHERE post_id = ? AND user_id = ?", [req.params.id, req.auth.userId], function (error, results, fields) {
            if (error) {
                return res.status(500).json({ error: error });
            }
            if (results.length == 0) {
                mysqlConf.query("INSERT INTO likes (post_id, user_id) VALUES (?, ?)", [req.params.id, req.auth.userId], function (error, results, fields) {
                    if (error) {
                        return res.status(500).json({ error: error });
                    }
                    //mettre à jour le nombre de likes
                    mysqlConf.query("UPDATE posts SET likes = likes + 1 WHERE id = ?", [req.params.id], function (error, results, fields) {
                        if (error) {
                            return res.status(500).json({ error: error });
                        } else {
                            return res.status(200).json({ message: "1" });
                        }
                    });
                });
            } else {
                return res.status(200).json({ message: "Post déjà liké" });
            }
        });
    });
}
exports.dislike = (req, res, next) => {
    mysqlConf.query("SELECT * FROM posts WHERE id = ?", [req.params.id], function (error, results, fields) {
        if (error) {
            return res.status(500).json({ error: error });
        }
        if (results.length == 0) {
            return res.status(404).json({ error: "Post non trouvé" });
        }
        mysqlConf.query("SELECT * FROM likes WHERE post_id = ? AND user_id = ?", [req.params.id, req.auth.userId], function (error, results, fields) {
            if (error) {
                return res.status(500).json({ error: error });
            }
            if (results.length == 0) {
                return res.status(200).json({ message: "Post déjà disliké" });
            } else {
                mysqlConf.query("DELETE FROM likes WHERE post_id = ? AND user_id = ?", [req.params.id, req.auth.userId], function (error, results, fields) {
                    if (error) {
                        return res.status(500).json({ error: error });
                    }
                    //mettre à jour le nombre de likes
                    mysqlConf.query("UPDATE posts SET likes = likes - 1 WHERE id = ?", [req.params.id], function (error, results, fields) {
                        if (error) {
                            return res.status(500).json({ error: error });
                        } else {
                            return res.status(200).json({ message: "0" });
                        }
                    });
                });
            }
        });
    });
}

//commenter
exports.comment = (req, res, next) => {
    if (req.body.comment === undefined || req.body.comment === "" || req.body.comment.trim() === "") {
        return res.status(400).json({ error: "Un commentaire est requis" });
    }
    if (req.body.comment.length > 280 || req.body.comment.length < 1) {
        return res.status(400).json({ error: "Le commentaire doit contenir entre 1 et 280 caractères" });
    }
    mysqlConf.query("SELECT * FROM posts WHERE id = ?", [req.params.id], function (error, results, fields) {
        if (error) {
            return res.status(500).json({ error: error });
        }
        if (results.length == 0) {
            return res.status(404).json({ error: "Post non trouvé" });
        }
        //only one comment per 30 seconds
        mysqlConf.query("SELECT * FROM comments WHERE `user_id` = ? AND `post_id` = ? AND `date` > ?", [req.auth.userId, req.params.id, moment().unix() - 10], function (error, results, fields) {
            if (error) {
                return res.status(500).json({ error: error });
            }
            if (results.length > 0) {
                return res.status(400).json({ error: "Vous ne pouvez commenter qu'une fois toutes les 10 secondes" });
            }

            mysqlConf.query("INSERT INTO comments (post_id, user_id, comment, date) VALUES (?, ?, ?, ?)", [req.params.id, req.auth.userId, req.body.comment, moment().unix()], function (error, results, fields) {
                if (error) {
                    return res.status(500).json({ error: error });
                }
                mysqlConf.query("UPDATE posts SET comments = comments + 1 WHERE id = ?", [req.params.id], function (error, results, fields) {
                    if (error) {
                        return res.status(500).json({ error: error });
                    } else {
                        return res.status(201).json({ message: "Commentaire ajouté" });
                    }
                });
            });
        });
    });
}
//get all comments of a post
exports.getComments = (req, res, next) => {
    mysqlConf.query("SELECT comments.*, users.username FROM `comments` inner JOIN users ON comments.user_id = users.id WHERE post_id = ? ORDER BY id DESC", [req.params.id], function (error, results, fields) {
        if (error) {
            return res.status(500).json({ error: error });
        }
        if (results.length == 0) {
            return res.status(404).json({ error: "Post non trouvé" });
        }
        return res.status(200).json(results);
    });
}