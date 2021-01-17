const { query } = require('../db/db');
const pool = require('../db/db');


const changeCompleteTask = (taskId) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if(err) {
                return reject(err);
            }

            const q = `SELECT completed FROM  tasks  WHERE id = ? `;
            pool.query(q, taskId, (err, results, fields) => {
                if(err) {
                    connection.release();
                   return reject(err.sqlMessage);
                }

             if(results[0].completed == 0) {
                 results[0].completed = true;
             }else {
                 results[0].completed = false;
             }

             pool.query('UPDATE tasks SET completed = ? WHERE id = ?', [results[0].completed, taskId], (err, result) => {
                 if(err) {
                     connection.release();
                     return reject(err.sqlMessage);
                 }

                 connection.release();
                 resolve(true);
             })
            
            })
        })
    })
}

const deleteTask = (taskId) => {
    //return promise
    return new Promise((resolve, reject) => {
        //create connection
        pool.getConnection((err, connection) => {
            //return error if there are a connection error
            if (err) {
                return reject(err);
            }
            //query to get the data
            const q = `DELETE FROM tasks WHERE id = ?`;
            //pool to connect with mysql server and the app
            pool.query(q, taskId, (err, results, fields) => {
                if(err) {
                    //close the connection
                    connection.release();
                    return reject(err.sqlMessage);
                }
        
                resolve(results[0]);
                connection.release();
            })
        })
    })

}


module.exports = {changeCompleteTask, deleteTask}