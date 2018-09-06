import pool from './database';

const answer = Symbol('private');

class Answer {
  constructor() { this[answer] = {}; }

  set userId(userId) { this[answer].userId = userId; }

  set questionId(questionId) { this[answer].questionId = questionId; }

  set accepted(accepted) { this[answer].accepted = accepted; }

  set voteCount(voteCount) { this[answer].voteCount = voteCount; }

  set body(body) { this[answer].body = body; }

  static createTable(callback) {
    const createTableQuery = 'CREATE TABLE IF NOT EXISTS answers ('
          + ' id SERIAL PRIMARY KEY,'
          + ' user_id integer REFERENCES users(id) ON DELETE CASCADE,'
          + ' question_id integer REFERENCES questions(id) ON DELETE CASCADE,'
          + ' body varchar(3000),'
          + ' accepted boolean DEFAULT false,'
          + ' vote_count integer DEFAULT 0,'
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
      text: 'SELECT answers.*, users.name AS username FROM answers LEFT JOIN users ON users.id = answers.user_id WHERE answers.id = $1',
      values: [`${id}`],
    };

    if (!id) getQuery = 'SELECT answers.*, users.name AS username FROM answers LEFT JOIN users ON users.id = answers.user_id ORDER BY id DESC LIMIT 1';

    pool.connect((error, client, done) => {
      if (error) return callback({ status: false, message: error.stack });
      return client.query(getQuery, (err, res) => {
        done();
        if (err) return callback({ status: false, messages: err.stack });
        return callback({ status: true, answer: res.rows[0] });
      });
    });
  }

  static rejectAnswers(id, callback) {
    const getQuery = {
      text: 'UPDATE answers SET accepted = false WHERE question_id = $1',
      values: [`${id}`],
    };

    pool.connect((error, client, done) => {
      if (error) return callback({ status: false, message: error.stack });
      return client.query(getQuery, (err) => {
        done();
        if (err) return callback({ status: false, messages: err.stack });
        return callback({ status: true, answer: {} });
      });
    });
  }

  save(callback) {
    const insertQuery = {
      text: 'INSERT INTO answers (user_id, question_id, body) VALUES ($1, $2, $3)',
      values: [`${this[answer].userId}`, `${this[answer].questionId}`, `${this[answer].body}`],
    };

    pool.connect((error, client, done) => {
      if (error) return callback({ status: false, message: error.stack });
      return client.query(insertQuery, (err) => {
        done();
        if (err) return callback({ status: false, messages: err.stack });
        return Answer.find(0, callback);
      });
    });
  }

  static update(id, anAnswer, callback) {
    let i = 0;
    const values = [];
    let set = '';
    if (anAnswer.body) {
      set += `body = $${i += 1} `;
      values.push(anAnswer.body);
    }
    if (anAnswer.voteCount) {
      set += `${set === '' ? '' : ','} ${anAnswer.voteCount === 1 ? 'vote_count = vote_count + 1 ' : 'vote_count = vote_count - 1 '}`;
    }
    set += `${set === '' ? '' : ','} accepted = $${i += 1} `;
    values.push(anAnswer.accepted || false);
    values.push(id);

    const updateQuery = {
      text: `UPDATE answers SET ${set} WHERE id = $${i += 1}`,
      values,
    };

    pool.connect((error, client, done) => {
      if (error) return callback({ status: false, message: error.stack });
      return client.query(updateQuery, (err) => {
        done();
        if (err) return callback({ status: false, messages: err.stack });
        return Answer.find(id, callback);
      });
    });
  }

  static findAll(callback) {
    const getQuery = 'SELECT answers.*, users.name AS username FROM answers LEFT JOIN users ON users.id = answers.user_id ORDER BY created_at';

    pool.connect((error, client, done) => {
      if (error) return callback({ status: false, message: error.stack });
      return client.query(getQuery, (err, res) => {
        done();
        if (err) return callback({ status: false, messages: err.stack });
        return callback({ status: true, answers: res.rows });
      });
    });
  }

  static findForQuestion(id, callback) {
    const getQuery = {
      text: 'SELECT answers.*, users.name AS username FROM answers LEFT JOIN users ON users.id = answers.user_id WHERE question_id = $1 ORDER BY answers.accepted DESC, answers.created_at ASC',
      values: [`${id}`],
    };

    pool.connect((error, client, done) => {
      if (error) return callback({ status: false, message: error.stack });
      return client.query(getQuery, (err, res) => {
        done();
        if (err) return callback({ status: false, messages: err.stack });
        return callback({ status: true, answers: res.rows });
      });
    });
  }

  static findForUser(id, sort, callback) {
    const orderBy = sort === 'top' ? ' ORDER BY answer_count DESC ' : ' ORDER BY created_at DESC ';
    const getQuery = {
      text: `SELECT answers.id AS answer_id, questions.* FROM answers LEFT JOIN questions ON questions.id = answers.question_id WHERE answers.user_id = $1 ${orderBy}`,
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

  static delete(id, callback) {
    const getQuery = {
      text: 'DELETE FROM answers WHERE id = $1',
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

  static empty(callback) {
    const emptyQuery = 'DELETE FROM answers';
    pool.connect((error, client, done) => {
      if (error) return callback(error);
      return client.query(emptyQuery, (err) => {
        done();
        return callback(err);
      });
    });
  }
}

export default Answer;
