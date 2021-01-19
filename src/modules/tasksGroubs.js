const pool = require('../db/db.js');


const getGroups = async (id) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
            }
            const q = `SELECT teamname, teams.id FROM group_map INNER JOIN teams ON team_id = teams.id WHERE user_id = ?`;
            pool.query(q, id, (err, results, fields) => {
                if (err) {
                    connection.release();
                    return reject(err.sqlMessage);
                }

                resolve(results);
                connection.release();
            })
        })
    })
}

//GET ALL TASKS IN SPACIFIC GROUP TO SPECIFIC USER
const getTasksGroup = async (userId, teamId, completed) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
            }
            const q = `
            SELECT username, teams.id AS teamId, task, completed, tasks.id AS taskId
            FROM users
            INNER JOIN group_map ON users.id = user_id
            INNER JOIN teams ON group_map.team_id = teams.id
            LEFT JOIN tasks ON group_map.team_id = tasks.team_id
            WHERE users.id = ? AND completed = ? AND tasks.team_id = ?
            ORDER BY tasks.id DESC; 
            `;
            pool.query(q, [userId, completed, teamId], (err, results, fields) => {
                if (err) {
                    connection.release();
                    return reject(err.sqlMessage);
                }

                resolve(results);
                connection.release();
            })
        })
    })
}
//is there is releastion betweent the user and the group
const joinedGroup = (userId, groupId) => {
    //return promise
    return new Promise((resolve, reject) => {
        //create connection
        pool.getConnection((err, connection) => {
            //return error if there are a connection error
            if (err) {
                return reject(err);
            }
            //query to get the data
            const q = `SELECT * 
            FROM group_map
        WHERE
            user_id = ?
            AND team_id = ?`;
            //pool to connect with mysql server and the app
            pool.query(q, [userId, groupId], (err, results) => {
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


const insertGroup = async (team) => {
    //return promise
    return new Promise((resolve, rejected) => {
        //create connection
        pool.getConnection((err, connection) => {
            //if there is any error here
            if (err) {
                return rejected(err.message);
            }
            //query that i wish to excute 
            const q = 'SELECT username, email, teamname FROM users INNER JOIN teams ON users.id = teams.own WHERE own = ? AND teamname = ?';
            //excute the query       
            pool.query(q, [team.own, team.teamname], (err, results, fields) => {
                //if there is any error please release the connection and return the error
                if (err) {
                    connection.release();
                    return rejected(err.sqlMessage);
                }
                //if the result.length of this query doe'st equal zero then the team already exist
                if (results.length !== 0) {
                    connection.release();
                    return rejected('you can\'t create two teams with the same name');
                }
                //secound query to insert the team in database if it's not 
                pool.query('INSERT INTO teams SET ?', [team], (error, result, field) => {
                    if (error) {
                        connection.release();
                        return rejected(error.sqlMessage);
                    }
                    //return the results
                    pool.query('INSERT INTO group_map(user_id, team_id) VALUES(?, ?)', [team.own, result.insertId], (err, results, fields) => {
                        if (err) {
                            connection.release();
                            return rejected(err.sqlMessage);
                        }

                        resolve(results);
                    })
                });
            });

        })
    })
}
//task object include task and team id , task_type
const createTask = async(task) => {
    return new Promise((resolve, reject) => {
        //create connection
        pool.getConnection((err, connection) => {
            if(err) {
                return reject(err);
            }

            const q = `INSERT INTO tasks SET ?`;
            pool.query(q, [task], (err, results) => {
                if(err) {
                    connection.release();
                    return reject(err.sqlMessage);
                }

                  connection.release();
                  resolve(results.insertId);
              })
            })
        })
}


//return the owner from the team 
const getOwnFromTeam = async (id) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if(err) {
                return reject(err)
            }
            //ubdate the query to get the username and email
            const q = `SELECT
            username,
            email,
            own AS ownId,
            teams.id AS teamId
        FROM
            users
            INNER JOIN teams ON users.id = own
        WHERE
            teams.id = ?`;
            pool.query(q, id, (err, result, fields) => {
                if(err) {
                    connection.release();
                    return reject(err.sqlMessage);
                }

                resolve(result[0]);
                connection.release();
            })
        })
    })
}

module.exports = {
     insertGroup,
     getGroups,
     getTasksGroup,
    joinedGroup,
    createTask,
    getOwnFromTeam
    };