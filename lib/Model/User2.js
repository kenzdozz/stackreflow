
// import bcrypt from 'bcrypt';
// import pool from './database';

// function createTable(callback) {
//   const createTableQuery = 'CREATE TABLE IF NOT EXISTS users ('
//         + ' id SERIAL PRIMARY KEY,'
//         + ' name varchar(100),'
//         + ' email varchar(100) UNIQUE,'
//         + ' password varchar(255),'
//         + ' createdAt date DEFAULT CURRENT_TIMESTAMP,'
//         + ' updatedAt date DEFAULT CURRENT_TIMESTAMP );';

//   pool.connect((error, client, done) => {
//     if (error) return callback({ status: false, message: error.stack });
//     return client.query(createTableQuery, (err, res) => {
//       done();
//       if (err) return callback({ status: false, messages: err.stack });
//       return callback({ status: true, data: res.rows });
//     });
//   });
// }

// function getUser(id, callback) {
//   const isEmail = Number.isNaN(parseInt(id, 10));
//   const where = isEmail ? 'LOWER(email) = LOWER($1)' : 'id = $1';
//   const getQuery = {
//     text: `SELECT * FROM users WHERE ${where}`,
//     values: [`${id}`],
//   };

//   pool.connect((error, client, done) => {
//     if (error) return callback({ status: false, message: error.stack });
//     return client.query(getQuery, (err, res) => {
//       done();
//       if (err) return callback({ status: false, messages: err.stack });
//       return callback({ status: true, user: res.rows[0] });
//     });
//   });
// }

// function createUser(user, callback) {
//   const password = bcrypt.hashSync(user.password, 10);
//   const insertQuery = {
//     text: 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
//     values: [`${user.name}`, `${user.email}`, `${password}`],
//   };

//   pool.connect((error, client, done) => {
//     if (error) return callback({ status: false, message: error.stack });
//     return client.query(insertQuery, (err) => {
//       done();
//       const msg = err.constraint ===
// 'users_email_key' ? 'User already exists' : 'An error has been encountered';
//       if (err) return callback({ status: false, messages: msg });
//       return getUser(user.email, callback);
//     });
//   });
// }

// function updateUser(id, user, callback) {
//   let i = 0;
//   const values = [];
//   let set; let
//     password = '';
//   if (user.name) {
//     set = `name = ${i += 1}`;
//     values.push(user.name);
//   }
//   if (user.email) {
//     set = `email = ${i += 1}`;
//     values.push(user.email);
//   }
//   if (user.password) {
//     password = bcrypt.hashSync(user.password, 10);
//     set = `password = ${i += 1}`;
//     values.push(password);
//   }

//   const updateQuery = {
//     text: `UPDATE users SET ${set} WHERE id = ${i}`,
//     values: values.push(id),
//   };

//   pool.connect((error, client, done) => {
//     if (error) return callback({ status: false, message: error.stack });
//     return client.query(updateQuery, (err) => {
//       done();
//       if (err) return callback({ status: false, messages: err.stack });
//       return getUser(user.email, callback);
//     });
//   });
// }

// function getUsers(callback) {
//   const getQuery = 'SELECT * FROM users ORDER BY createdAt';

//   pool.connect((error, client, done) => {
//     if (error) return callback({ status: false, message: error.stack });
//     return client.query(getQuery, (err, res) => {
//       done();
//       if (err) return callback({ status: false, messages: err.stack });
//       return callback({ status: true, data: res.rows });
//     });
//   });
// }

// export {
//   createTable, createUser, updateUser, getUser, getUsers,
// };
"use strict";