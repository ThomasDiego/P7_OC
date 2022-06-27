var mysql = require('mysql2');
require('dotenv').config();
var config;
config = {
    mysql_pool: mysql.createPool({
        connectionLimit: 100,
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DB
    })
};
module.exports = config;