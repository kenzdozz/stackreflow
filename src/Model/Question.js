import pool from './database';

const question = Symbol('private');

class Question {
  constructor() { this[question] = {}; }

  set userId(userId) { this[question].userId = userId; }

  set title(title) { this[question].title = title; }

  set body(body) { this[question].body = body; }

  set tags(tags) { this[question].tags = tags; }

  static createTable(callback) {
    const createTableQuery = 'CREATE TABLE IF NOT EXISTS questions ('
          + ' id SERIAL PRIMARY KEY,'
          + ' user_id integer REFERENCES users(id) ON DELETE CASCADE,'
          + ' title varchar(100),'
          + ' body varchar(3000),'
          + ' tags varchar(255) NULL,'
          + ' answer_count integer DEFAULT 0,'
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
    let getQuery = {
      text: 'SELECT * FROM questions WHERE id = $1',
      values: [`${id}`],
    };

    if (!id) getQuery = 'SELECT * FROM questions ORDER BY id DESC LIMIT 1';

    pool.connect((error, client, done) => {
      if (error) return callback({ status: false, message: error.stack });
      return client.query(getQuery, (err, res) => {
        done();
        if (err) return callback({ status: false, messages: err.stack });
        return callback({ status: true, question: res.rows[0] });
      });
    });
  }

  save(callback) {
    const insertQuery = {
      text: 'INSERT INTO questions (user_id, title, body, tags) VALUES ($1, $2, $3, $4)',
      values: [`${this[question].userId}`, `${this[question].title}`, `${this[question].body}`, `${this[question].tags}`],
    };

    pool.connect((error, client, done) => {
      if (error) return callback({ status: false, message: error.stack });
      return client.query(insertQuery, (err) => {
        done();
        if (err) return callback({ status: false, messages: err.stack });
        return Question.find(0, callback);
      });
    });
  }

  static update(id, aQuestion, callback) {
    let i = 0;
    const values = [];
    let set;
    if (aQuestion.title) {
      set += `title = ${i += 1} `;
      values.push(aQuestion.title);
    }
    if (aQuestion.body) {
      set += `body = ${i += 1} `;
      values.push(aQuestion.body);
    }
    if (aQuestion.tags) {
      set += `tags = ${i += 1} `;
      values.push(aQuestion.tags);
    }
    values.push(id);

    const updateQuery = {
      text: `UPDATE questions SET ${set} WHERE id = $${id}`,
      values,
    };

    pool.connect((error, client, done) => {
      if (error) return callback({ status: false, message: error.stack });
      return client.query(updateQuery, (err) => {
        done();
        if (err) return callback({ status: false, messages: err.stack });
        return Question.find(id, callback);
      });
    });
  }

  static findAll(callback) {
    const getQuery = 'SELECT * FROM questions ORDER BY createdAt';

    pool.connect((error, client, done) => {
      if (error) return callback({ status: false, message: error.stack });
      return client.query(getQuery, (err, res) => {
        done();
        if (err) return callback({ status: false, messages: err.stack });
        return callback({ status: true, data: res.rows });
      });
    });
  }

  static findForUser(id, callback) {
    const getQuery = {
      text: 'SELECT * FROM questions WHERE user_id = $1',
      values: [`${id}`],
    };

    pool.connect((error, client, done) => {
      if (error) return callback({ status: false, message: error.stack });
      return client.query(getQuery, (err, res) => {
        done();
        if (err) return callback({ status: false, messages: err.stack });
        return callback({ status: true, data: res.rows });
      });
    });
  }

  static delete(id, callback) {
    const getQuery = {
      text: 'DELETE FROM questions WHERE id = $1',
      values: [`${id}`],
    };

    pool.connect((error, client, done) => {
      if (error) return callback({ status: false, message: error.stack });
      return client.query(getQuery, (err) => {
        done();
        if (err) return callback({ status: false, messages: err.stack });
        return callback({ status: true, data: {} });
      });
    });
  }
}

export default Question;
