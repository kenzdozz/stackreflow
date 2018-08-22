import bcrypt from 'bcrypt';
import pool from './database';

const user = Symbol('private');
class User {
  constructor() { this[user] = {}; }

  set name(newName) { this[user].name = newName; }

  set email(newEmail) { this[user].email = newEmail; }

  set password(newPassword) { this[user].password = newPassword; }

  static createTable(callback) {
    const createTableQuery = 'CREATE TABLE IF NOT EXISTS users ('
          + ' id SERIAL PRIMARY KEY,'
          + ' name varchar(100),'
          + ' email varchar(100) UNIQUE,'
          + ' password varchar(255),'
          + ' createdAt date DEFAULT CURRENT_TIMESTAMP,'
          + ' updatedAt date DEFAULT CURRENT_TIMESTAMP );';

    pool.connect((error, client, done) => {
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
    const where = isEmail ? 'LOWER(email) = LOWER($1)' : 'id = $1';
    const getQuery = {
      text: `SELECT * FROM users WHERE ${where}`,
      values: [`${id}`],
    };

    pool.connect((error, client, done) => {
      if (error) return callback({ status: false, message: error.stack });
      return client.query(getQuery, (err, res) => {
        done();
        if (err) return callback({ status: false, messages: err.stack });
        return callback({ status: true, user: res.rows[0] });
      });
    });
  }

  save(callback) {
    const password = bcrypt.hashSync(this[user].password, 10);
    const insertQuery = {
      text: 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
      values: [`${this[user].name}`, `${this[user].email}`, `${password}`],
    };

    pool.connect((error, client, done) => {
      if (error) return callback({ status: false, message: error.stack });
      return client.query(insertQuery, (err) => {
        done();
        const msg = err.constraint === 'users_email_key' ? 'duplicate' : err.stack;
        if (err) return callback({ status: false, messages: msg });
        return User.find(this[user].email, callback);
      });
    });
  }

  static update(id, aUser, callback) {
    let i = 0;
    const values = [];
    let set; let
      password = '';
    if (aUser.name) {
      set = `name = ${i += 1}`;
      values.push(aUser.name);
    }
    if (aUser.email) {
      set = `email = ${i += 1}`;
      values.push(aUser.email);
    }
    if (aUser.password) {
      password = bcrypt.hashSync(aUser.password, 10);
      set = `password = ${i += 1}`;
      values.push(password);
    }
    values.push(id);

    const updateQuery = {
      text: `UPDATE users SET ${set} WHERE id = $${i}`,
      values,
    };

    pool.connect((error, client, done) => {
      if (error) return callback({ status: false, message: error.stack });
      return client.query(updateQuery, (err) => {
        done();
        if (err) return callback({ status: false, messages: err.stack });
        return User.find(aUser.email, callback);
      });
    });
  }

  static findAll(callback) {
    const getQuery = 'SELECT * FROM users ORDER BY createdAt';

    pool.connect((error, client, done) => {
      if (error) return callback({ status: false, message: error.stack });
      return client.query(getQuery, (err, res) => {
        done();
        if (err) return callback({ status: false, messages: err.stack });
        return callback({ status: true, users: res.rows });
      });
    });
  }
}

export default User;
