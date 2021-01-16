const pool = require('../db/db');


const changeCompleteTask = (taskId, updated) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if(err) {
                return reject(err);
            }

            const q = `SELECT id AS taskId, task FROM  tasks  WHERE id = ? `;
            pool.query(q, taskId, (err, results, fields) => {
                if(err) {
                    connection.release();
                   return reject(err.sqlMessage);
                }

                results[0].completed = true;
                pool.query('UPDATE tasks SET completed = ? WHERE id = ?', [updated, taskId], (err, result) => {
                    if(err) {
                        connection.release();
                        return reject(err.sqlMessage);
                    }

                    connection.release();
                    resolve(results[0]);
                });

            })
        })
    })
}


module.exports = {changeCompleteTask}