const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit:10,
    host:'localhost',
    user:'root',
    password:process.env.DATABASESECRETE,// in env folder please
    database:'task_manager'
});

module.exports = pool;

