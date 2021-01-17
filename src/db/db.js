const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit:10,
    host:process.env.DATABASEHOST,
    user:process.env.DATABASEUSERNAME,
    password:process.env.DATABASESECRETE,// in env folder please
    database:process.env.DATABASEUSED
});

module.exports = pool;

