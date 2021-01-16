const pool = require('../db/db');

const getAllUsersFromGroup = (teamId) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if(err) {
                return reject(err);
            }
            const q = `SELECT
            username,
            email,
            users.id AS user_id
        FROM
            users
            INNER JOIN group_map ON users.id = user_id
        WHERE
            team_id = ?`
            pool.query(q, teamId, (err, results, fields) => {
                if(err) {
                    connection.release();
                    return reject(err.sqlMessage);
                }

                connection.release();
                resolve(results);
            })
        })
    })
}

const insertUserInGroup = (userId, teamId) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if(err) {
                return reject(err);
            }
            const q1 = `SELECT
            *
        FROM
            group_map
        WHERE
        user_id = ? AND team_id = ?`
            pool.query(q1, [userId, teamId], (err, results, fields) => {
                if(err) {
                    connection.release();
                    return reject(err.sqlMessage);
                }

                if(results.length !== 0) {
                    return reject('the user already exist in the group');
                }

                const q2 = `INSERT INTO group_map(user_id, team_id) VALUES (?, ?)`;
                pool.query(q2, [userId, teamId], (err, result) => {
                    if(err) {
                        connection.release();
                        reject(err.sqlMessage);
                    }

                    connection.release();
                    resolve(result);
                })
                
            })
        })
    })
}

const deleteUserFromGroup = (userId, teamId) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if(err) {
                return reject(err);
            }
            const q = `DELETE FROM group_map WHERE user_id = ? AND team_id = ?`
            pool.query(q, [userId, teamId], (err, results, fields) => {
                if(err) {
                    connection.release();
                    return reject(err.sqlMessage);
                }

                connection.release();
                console.log(results);
                resolve(results);
            })
        })
    })
}

const updateGroupName = (groupName, teamId) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if(err) {
                return reject(err);
            }
            const q = `UPDATE teams SET teamname = ? WHERE id = ?`
            pool.query(q, [groupName, teamId], (err, results, fields) => {
                if(err) {
                    connection.release();
                    return reject(err.sqlMessage);
                }

                connection.release();
                resolve(results);
            })
        })
    })
}


module.exports = {getAllUsersFromGroup, insertUserInGroup, deleteUserFromGroup, updateGroupName};
