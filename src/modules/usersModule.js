const pool = require('../db/db.js');
const bcrypt = require('bcryptjs');
//insert new user to database 
const insertUser = async (user) => {
    //the best way to store the data in database
    user.user_password = await bcrypt.hash(user.user_password, 8);
    user.email = user.email.toLowerCase().trim();
    user.username = user.username.trim();

    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                //if there is an error in connection will end the function and reject the error
                return reject(err);
            }
            //query to insert New user 
            pool.query('INSERT INTO users SET ?', [user], (err, results, fields) => {
                if (err) {
                    //if there is an error end the connection and reject the promise
                    connection.release();
                    return reject("the email is already exist please try to sign in");
                }
                //send the data to signup.controller if all things is sucessful
                resolve(results);
                //end the connection
                connection.release();
            });

        })
    })
}

const findUser = (user) => {
    //return promise and interact with promise as Async funciton
    return new Promise((resolve, reject) => {
        //create connection from pool
        pool.getConnection((err, connection) => {
            //if there are a problem reject it and end the function
            if (err) {
                return reject(err);
            }
            // query to interact with mysql server and get the id and the password hashed
            pool.query('SELECT id, user_password FROM users WHERE email=?',
                user.email, async (err, results) => {
                    //if there is any problem with query reject it
                    if (err) {
                        connection.release();
                        return reject(err);
                    }
                    //end the connection pool
                    connection.release();
                    //if there is no user reject the error
                    if (results.length === 0) {
                        return reject('Invalid email or Password');
                    }
                    //compare the passwords and return false
                    const compared = await bcrypt.compare(user.password, results[0].user_password);
                    if(!compared) {
                        return reject('Invalid Email or Password');
                    }
                    resolve(results[0]);
                })
        })
    })

}

const findUserById = async (id) => {
    //return promise and interact with promise as Async funciton
    return new Promise((resolve, reject) => {
        //create connection from pool
        //if the id is undefinded
        if(!id) {
            //resolve the result as undefined 
            // i used resolve to insert into user undefined if there is no id 
            return resolve(undefined);
        }
        pool.getConnection((err, connection) => {
            //if there are a problem reject it and end the function
            if(err) {
                return reject(err);
            }

            // query to interact with mysql server and get the use by id
            pool.query('SELECT id, username, email, created_at FROM users WHERE id = ?',
             id, (err, result, fields) => {
                 if(err) {
                     connection.release();
                     return reject(err);
                 }
                 //end the connection
                 connection.release();
                 //if there is no user 
                 if(result.length === 0) {
                     return resolve(undefined);
                 }

                 resolve(result[0]);
             })
        })
    })
}

const findUserByEmail= async (email) => {
    //return promise and interact with promise as Async funciton
    return new Promise((resolve, reject) => {
        //create connection from pool
        //if the id is undefinded
        if(!email) {
            //resolve the result as undefined 
            // i used resolve to insert into user undefined if there is no id 
            return resolve(undefined);
        }
        pool.getConnection((err, connection) => {
            //if there are a problem reject it and end the function
            if(err) {
                return reject(err);
            }

            // query to interact with mysql server and get the use by id
            pool.query('SELECT * FROM users WHERE email = ?',
             email, (err, result, fields) => {
                 if(err) {
                     connection.release();
                     return reject(err);
                 }
                 //end the connection
                 connection.release();
                 resolve(result[0]);
             })
        })
    })
}

module.exports = { insertUser, findUser, findUserById, findUserByEmail};
