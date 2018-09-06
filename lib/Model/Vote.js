'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _database = require('./database');

var _database2 = _interopRequireDefault(_database);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const aVote = Symbol('private');

class Vote {
  constructor() {
    this[aVote] = {};
  }

  set userId(userId) {
    this[aVote].userId = userId;
  }

  set answerId(answerId) {
    this[aVote].answerId = answerId;
  }

  set vote(vote) {
    this[aVote].vote = vote;
  }

  static createTable(callback) {
    const createTableQuery = 'CREATE TABLE IF NOT EXISTS votes (' + ' id SERIAL PRIMARY KEY,' + ' user_id integer REFERENCES users(id) ON DELETE CASCADE,' + ' answer_id integer REFERENCES answers(id) ON DELETE CASCADE,' + ' vote integer,' + ' created_at timestamp DEFAULT CURRENT_TIMESTAMP,' + ' updated_at timestamp DEFAULT CURRENT_TIMESTAMP );';

    _database2.default.connect((error, client, done) => {
      if (error) return callback({ status: false, message: error.stack });
      return client.query(createTableQuery, (err, res) => {
        done();
        if (err) return callback({ status: false, messages: err.stack });
        return callback({ status: true, data: res.rows });
      });
    });
  }

  static find(uId, aId, callback) {
    let getQuery = {
      text: 'SELECT * FROM votes WHERE user_id = $1 AND answer_id = $2',
      values: [uId, aId]
    };

    if (!aId) getQuery = { text: 'SELECT * FROM votes WHERE id = $1', values: [uId] };

    _database2.default.connect((error, client, done) => {
      if (error) return callback({ status: false, message: error.stack });
      return client.query(getQuery, (err, res) => {
        done();
        if (err) return callback({ status: false, messages: err.stack });
        return callback({ status: true, vote: res.rows[0] });
      });
    });
  }

  save(callback) {
    const insertQuery = {
      text: 'INSERT INTO votes (user_id, answer_id, vote) VALUES ($1, $2, $3)',
      values: [`${this[aVote].userId}`, `${this[aVote].answerId}`, `${this[aVote].vote}`]
    };

    _database2.default.connect((error, client, done) => {
      if (error) return callback({ status: false, message: error.stack });
      return client.query(insertQuery, err => {
        done();
        if (err) return callback({ status: false, messages: err.stack });
        return Vote.find(this[aVote].userId, this[aVote].answerId, callback);
      });
    });
  }

  static update(id, theVote, callback) {
    const updateQuery = {
      text: 'UPDATE votes SET vote = $1 WHERE id = $2',
      values: [theVote.vote, id]
    };

    _database2.default.connect((error, client, done) => {
      if (error) return callback({ status: false, message: error.stack });
      return client.query(updateQuery, err => {
        done();
        if (err) return callback({ status: false, messages: err.stack });
        return Vote.find(id, null, callback);
      });
    });
  }

  // static findAll(callback) {
  //   const getQuery = 'SELECT votes.*, users.name AS username FROM votes LEFT JOIN users ON users.id = votes.user_id ORDER BY created_at';

  //   pool.connect((error, client, done) => {
  //     if (error) return callback({ status: false, message: error.stack });
  //     return client.query(getQuery, (err, res) => {
  //       done();
  //       if (err) return callback({ status: false, messages: err.stack });
  //       return callback({ status: true, votes: res.rows });
  //     });
  //   });
  // }

  // static findForAnswer(id, callback) {
  //   const getQuery = {
  //     text: 'SELECT votes.*, users.name AS username FROM votes LEFT JOIN users ON users.id = votes.user_id WHERE answer_id = $1',
  //     values: [`${id}`],
  //   };

  //   pool.connect((error, client, done) => {
  //     if (error) return callback({ status: false, message: error.stack });
  //     return client.query(getQuery, (err, res) => {
  //       done();
  //       if (err) return callback({ status: false, messages: err.stack });
  //       return callback({ status: true, votes: res.rows });
  //     });
  //   });
  // }

  static delete(id, callback) {
    const getQuery = {
      text: 'DELETE FROM votes WHERE id = $1',
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
    const emptyQuery = 'DELETE FROM votes';
    _database2.default.connect((error, client, done) => {
      if (error) return callback(error);
      return client.query(emptyQuery, err => {
        done();
        return callback(err);
      });
    });
  }
}

exports.default = Vote;