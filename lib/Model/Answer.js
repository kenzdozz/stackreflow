'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _database = require('./database');

var _database2 = _interopRequireDefault(_database);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const answer = Symbol('private');

class Answer {
  constructor() {
    this[answer] = {};
  }

  set userId(userId) {
    this[answer].userId = userId;
  }

  set questionId(questionId) {
    this[answer].questionId = questionId;
  }

  set accepted(accepted) {
    this[answer].accepted = accepted;
  }

  set voteCount(voteCount) {
    this[answer].voteCount = voteCount;
  }

  set body(body) {
    this[answer].body = body;
  }

  static createTable(callback) {
    const createTableQuery = 'CREATE TABLE IF NOT EXISTS answers (' + ' id SERIAL PRIMARY KEY,' + ' user_id integer REFERENCES users(id) ON DELETE CASCADE,' + ' question_id integer REFERENCES questions(id) ON DELETE CASCADE,' + ' body varchar(3000),' + ' accepted boolean DEFAULT false,' + ' vote_count integer DEFAULT 0,' + ' created_at date DEFAULT CURRENT_TIMESTAMP,' + ' updated_at date DEFAULT CURRENT_TIMESTAMP );';

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
    let getQuery = {
      text: 'SELECT * FROM answers WHERE id = $1',
      values: [`${id}`]
    };

    if (!id) getQuery = 'SELECT * FROM answers ORDER BY id DESC LIMIT 1';

    _database2.default.connect((error, client, done) => {
      if (error) return callback({ status: false, message: error.stack });
      return client.query(getQuery, (err, res) => {
        done();
        if (err) return callback({ status: false, messages: err.stack });
        return callback({ status: true, answer: res.rows[0] });
      });
    });
  }

  save(callback) {
    const insertQuery = {
      text: 'INSERT INTO answers (user_id, question_id, body) VALUES ($1, $2, $3)',
      values: [`${this[answer].userId}`, `${this[answer].questionId}`, `${this[answer].body}`]
    };

    _database2.default.connect((error, client, done) => {
      if (error) return callback({ status: false, message: error.stack });
      return client.query(insertQuery, err => {
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
    if (anAnswer.accepted) {
      set += `accepted = $${i += 1} `;
      values.push(anAnswer.accepted);
    }
    if (anAnswer.voteCount) {
      set += `vote_count = $${i += 1} `;
      values.push(anAnswer.voteCount);
    }
    values.push(id);

    const updateQuery = {
      text: `UPDATE answers SET ${set} WHERE id = $${i += 1}`,
      values
    };

    _database2.default.connect((error, client, done) => {
      if (error) return callback({ status: false, message: error.stack });
      return client.query(updateQuery, err => {
        done();
        if (err) return callback({ status: false, messages: err.stack });
        return Answer.find(id, callback);
      });
    });
  }

  static findAll(callback) {
    const getQuery = 'SELECT * FROM answers ORDER BY created_at';

    _database2.default.connect((error, client, done) => {
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
      text: 'SELECT * FROM answers WHERE question_id = $1',
      values: [`${id}`]
    };

    _database2.default.connect((error, client, done) => {
      if (error) return callback({ status: false, message: error.stack });
      return client.query(getQuery, (err, res) => {
        done();
        if (err) return callback({ status: false, messages: err.stack });
        return callback({ status: true, answers: res.rows });
      });
    });
  }

  static delete(id, callback) {
    const getQuery = {
      text: 'DELETE FROM answers WHERE id = $1',
      values: [`${id}`]
    };

    _database2.default.connect((error, client, done) => {
      if (error) return callback({ status: false, message: error.stack });
      return client.query(getQuery, err => {
        done();
        if (err) return callback({ status: false, messages: err.stack });
        return callback({ status: true, data: {} });
      });
    });
  }

  static empty(callback) {
    const emptyQuery = 'DELETE FROM answers';
    _database2.default.connect((error, client, done) => {
      if (error) return callback(error);
      return client.query(emptyQuery, err => {
        done();
        return callback(err);
      });
    });
  }
}

exports.default = Answer;