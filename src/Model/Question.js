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
          + ' answered boolean DEFAULT false,'
          + ' answer_count integer DEFAULT 0,'
          + ' view_count integer DEFAULT 0,'
          + ' created_at timestamp DEFAULT CURRENT_TIMESTAMP,'
          + ' updated_at timestamp DEFAULT CURRENT_TIMESTAMP );';

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
      text: 'SELECT questions.*, users.name AS username FROM questions LEFT JOIN users ON users.id = questions.user_id WHERE questions.id = $1 ',
      values: [`${id}`],
    };

    if (!id) getQuery = 'SELECT questions.*, users.name AS username FROM questions LEFT JOIN users ON users.id = questions.user_id ORDER BY id DESC LIMIT 1';

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
    let set = '';
    if (aQuestion.title) {
      set += `title = $${i += 1} `;
      values.push(aQuestion.title);
    }
    if (aQuestion.body) {
      set += `${set === '' ? '' : ','} body = $${i += 1} `;
      values.push(aQuestion.body);
    }
    if (aQuestion.tags) {
      set += `${set === '' ? '' : ','} tags = $${i += 1} `;
      values.push(aQuestion.tags);
    }
    if (aQuestion.view_count) {
      set += `${set === '' ? '' : ','} view_count = view_count + 1 `;
    }
    if (aQuestion.answer_count) {
      set += `${set === '' ? '' : ','} ${aQuestion.answer_count === 1 ? 'answer_count = answer_count + 1 ' : 'answer_count = answer_count - 1 '}`;
    }
    set += `${set === '' ? '' : ','} answered = $${i += 1} `;
    values.push(aQuestion.answered || false);
    values.push(id);

    const updateQuery = {
      text: `UPDATE questions SET ${set} WHERE id = $${i += 1}`,
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
    const getQuery = 'SELECT questions.*, users.name AS username FROM questions LEFT JOIN users ON users.id = questions.user_id ORDER BY questions.created_at DESC';

    pool.connect((error, client, done) => {
      if (error) return callback({ status: false, message: error.stack });
      return client.query(getQuery, (err, res) => {
        done();
        if (err) return callback({ status: false, messages: err.stack });
        return callback({ status: true, questions: res.rows });
      });
    });
  }

  static findForUser(id, sort, callback) {
    const orderBy = sort === 'top' ? ' ORDER BY answer_count DESC ' : ' ORDER BY created_at DESC ';
    const getQuery = {
      text: `SELECT * FROM questions WHERE user_id = $1 ${orderBy}`,
      values: [`${id}`],
    };

    pool.connect((error, client, done) => {
      if (error) return callback({ status: false, message: error.stack });
      return client.query(getQuery, (err, res) => {
        done();
        if (err) return callback({ status: false, messages: err.stack });
        return callback({ status: true, questions: res.rows });
      });
    });
  }

  static search(text, callback) {
    const getQuery = {
      text: `SELECT questions.*, users.name AS username FROM questions LEFT JOIN users ON users.id = questions.user_id WHERE LOWER(questions.title) LIKE LOWER($1) ORDER BY questions.created_at DESC`,
      values: [`%${text}%`],
    }

    pool.connect((error, client, done) => {
      if (error) return callback({ status: false, message: error.stack });
      return client.query(getQuery, (err, res) => {
        done();
        if (err) return callback({ status: false, messages: err.stack });
        return callback({ status: true, questions: res.rows });
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
        return callback({ status: true, question: {} });
      });
    });
  }

  static empty(callback) {
    const emptyQuery = 'DELETE FROM questions';
    pool.connect((error, client, done) => {
      if (error) return callback(error);
      return client.query(emptyQuery, (err) => {
        done();
        return callback(err);
      });
    });
  }
}

export default Question;
