'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _database = require('./database');

var _database2 = _interopRequireDefault(_database);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const user = Symbol('private');
class User {
  constructor() {
    this[user] = {};
  }

  set name(newName) {
    this[user].name = newName;
  }

  set email(newEmail) {
    this[user].email = newEmail;
  }

  set password(newPassword) {
    this[user].password = newPassword;
  }

  static createTable(callback) {
    const createTableQuery = 'CREATE TABLE IF NOT EXISTS users (' + ' id SERIAL PRIMARY KEY,' + ' name varchar(100),' + ' email varchar(100) UNIQUE,' + ' password varchar(255),' + ' created_at timestamp DEFAULT CURRENT_TIMESTAMP,' + ' updated_at timestamp DEFAULT CURRENT_TIMESTAMP );';

    _database2.default.connect((error, client, done) => {
      if (error) return callback({ status: false, message: error.stack });
      return client.query(createTableQuery, (err, res) => {
        done();
        if (err) return callback({ status: false, messages: err.stack });
        return callback({ status: true, data: res.rows });
      });
    });
  }

  static find(id, callback) {
    const isEmail = Number.isNaN(parseInt(id, 10));
    const where = isEmail ? 'LOWER(users.email) = LOWER($1)' : 'users.id = $1';
    const getQuery = {
      text: `SELECT users.*, (SELECT COUNT(questions.id) FROM questions WHERE questions.user_id = users.id) AS question_count, (SELECT COUNT(answers.id) FROM answers WHERE answers.user_id = users.id) AS answer_count FROM users WHERE ${where} GROUP BY users.id`,
      values: [`${id}`]
    };

    _database2.default.connect((error, client, done) => {
      if (error) return callback({ status: false, message: error.stack });
      return client.query(getQuery, (err, res) => {
        done();
        if (err) return callback({ status: false, messages: err.stack });
        return callback({ status: true, user: res.rows[0] });
      });
    });
  }

  save(callback) {
    const password = _bcrypt2.default.hashSync(this[user].password, 10);
    const insertQuery = {
      text: 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
      values: [`${this[user].name}`, `${this[user].email}`, `${password}`]
    };

    _database2.default.connect((error, client, done) => {
      if (error) return callback({ status: false, message: error.stack });
      return client.query(insertQuery, err => {
        done();
        if (err) {
          const msg = err.constraint === 'users_email_key' ? 'duplicate' : err.stack;
          return callback({ status: true, message: msg });
        }
        return User.find(this[user].email, callback);
      });
    });
  }

  // static update(id, aUser, callback) {
  //   let i = 0;
  //   const values = [];
  //   let set = '';
  //   let password = '';
  //   if (aUser.name) {
  //     set = `name = $${i += 1}`;
  //     values.push(aUser.name);
  //   }
  //   if (aUser.email) {
  //     set = `${set === '' ? '' : ','} email = $${i += 1}`;
  //     values.push(aUser.email);
  //   }
  //   if (aUser.password) {
  //     password = bcrypt.hashSync(aUser.password, 10);
  //     set = `${set === '' ? '' : ','} password = $${i += 1}`;
  //     values.push(password);
  //   }
  //   values.push(id);

  //   const updateQuery = {
  //     text: `UPDATE users SET ${set} WHERE id = $${i += 1}`,
  //     values,
  //   };

  //   pool.connect((error, client, done) => {
  //     if (error) return callback({ status: false, message: error.stack });
  //     return client.query(updateQuery, (err) => {
  //       done();
  //       if (err) return callback({ status: false, messages: err.stack });
  //       return User.find(aUser.email, callback);
  //     });
  //   });
  // }

  static findAll(callback) {
    const getQuery = 'SELECT users.*, (SELECT COUNT(questions.id) FROM questions WHERE questions.user_id = users.id) AS question_count, (SELECT COUNT(answers.id) FROM answers WHERE answers.user_id = users.id) AS answer_count FROM users GROUP BY users.id';

    _database2.default.connect((error, client, done) => {
      if (error) return callback({ status: false, message: error.stack });
      return client.query(getQuery, (err, res) => {
        done();
        if (err) return callback({ status: false, messages: err.stack });
        return callback({ status: true, users: res.rows });
      });
    });
  }

  // static delete(id, callback) {
  //   const isEmail = Number.isNaN(parseInt(id, 10));
  //   const where = isEmail ? 'LOWER(email) = LOWER($1)' : 'id = $1';
  //   const getQuery = {
  //     text: `DELETE FROM users WHERE ${where}`,
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

  static empty(callback) {
    const emptyQuery = 'DELETE FROM users';
    _database2.default.connect((error, client, done) => {
      if (error) return callback(error);
      return client.query(emptyQuery, err => {
        done();
        return callback(err);
      });
    });
  }
}

exports.default = User;