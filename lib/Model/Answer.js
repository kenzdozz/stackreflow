'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _database = require('./database');

var _database2 = _interopRequireDefault(_database);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var answer = Symbol('private');

var Answer = function () {
  function Answer() {
    _classCallCheck(this, Answer);

    this[answer] = {};
  }

  _createClass(Answer, [{
    key: 'save',
    value: function save(callback) {
      var insertQuery = {
        text: 'INSERT INTO answers (user_id, question_id, body) VALUES ($1, $2, $3)',
        values: ['' + this[answer].userId, '' + this[answer].questionId, '' + this[answer].body]
      };

      _database2.default.connect(function (error, client, done) {
        if (error) return callback({ status: false, message: error.stack });
        return client.query(insertQuery, function (err) {
          done();
          if (err) return callback({ status: false, messages: err.stack });
          return Answer.find(0, callback);
        });
      });
    }
  }, {
    key: 'userId',
    set: function set(userId) {
      this[answer].userId = userId;
    }
  }, {
    key: 'questionId',
    set: function set(questionId) {
      this[answer].questionId = questionId;
    }
  }, {
    key: 'accepted',
    set: function set(accepted) {
      this[answer].accepted = accepted;
    }
  }, {
    key: 'voteCount',
    set: function set(voteCount) {
      this[answer].voteCount = voteCount;
    }
  }, {
    key: 'body',
    set: function set(body) {
      this[answer].body = body;
    }
  }], [{
    key: 'createTable',
    value: function createTable(callback) {
      var createTableQuery = 'CREATE TABLE IF NOT EXISTS answers (' + ' id SERIAL PRIMARY KEY,' + ' user_id integer REFERENCES users(id) ON DELETE CASCADE,' + ' question_id integer REFERENCES questions(id) ON DELETE CASCADE,' + ' body varchar(3000),' + ' accepted boolean DEFAULT false,' + ' vote_count integer DEFAULT 0,' + ' created_at date DEFAULT CURRENT_TIMESTAMP,' + ' updated_at date DEFAULT CURRENT_TIMESTAMP );';

      _database2.default.connect(function (error, client, done) {
        if (error) return callback({ status: false, message: error.stack });
        return client.query(createTableQuery, function (err, res) {
          done();
          if (err) return callback({ status: false, messages: err.stack });
          return callback({ status: true, data: res.rows });
        });
      });
    }
  }, {
    key: 'find',
    value: function find(id, callback) {
      var getQuery = {
        text: 'SELECT * FROM answers WHERE id = $1',
        values: ['' + id]
      };

      if (!id) getQuery = 'SELECT * FROM answers ORDER BY id DESC LIMIT 1';

      _database2.default.connect(function (error, client, done) {
        if (error) return callback({ status: false, message: error.stack });
        return client.query(getQuery, function (err, res) {
          done();
          if (err) return callback({ status: false, messages: err.stack });
          return callback({ status: true, answer: res.rows[0] });
        });
      });
    }
  }, {
    key: 'update',
    value: function update(id, anAnswer, callback) {
      var i = 0;
      var values = [];
      var set = '';
      if (anAnswer.body) {
        set += 'body = $' + (i += 1) + ' ';
        values.push(anAnswer.body);
      }
      if (anAnswer.accepted) {
        set += 'accepted = $' + (i += 1) + ' ';
        values.push(anAnswer.accepted);
      }
      if (anAnswer.voteCount) {
        set += 'vote_count = $' + (i += 1) + ' ';
        values.push(anAnswer.voteCount);
      }
      values.push(id);

      var updateQuery = {
        text: 'UPDATE answers SET ' + set + ' WHERE id = $' + (i += 1),
        values: values
      };

      _database2.default.connect(function (error, client, done) {
        if (error) return callback({ status: false, message: error.stack });
        return client.query(updateQuery, function (err) {
          done();
          if (err) return callback({ status: false, messages: err.stack });
          return Answer.find(id, callback);
        });
      });
    }
  }, {
    key: 'findAll',
    value: function findAll(callback) {
      var getQuery = 'SELECT * FROM answers ORDER BY createdAt';

      _database2.default.connect(function (error, client, done) {
        if (error) return callback({ status: false, message: error.stack });
        return client.query(getQuery, function (err, res) {
          done();
          if (err) return callback({ status: false, messages: err.stack });
          return callback({ status: true, answers: res.rows });
        });
      });
    }
  }, {
    key: 'findForQuestion',
    value: function findForQuestion(id, callback) {
      var getQuery = {
        text: 'SELECT * FROM answers WHERE question_id = $1',
        values: ['' + id]
      };

      _database2.default.connect(function (error, client, done) {
        if (error) return callback({ status: false, message: error.stack });
        return client.query(getQuery, function (err, res) {
          done();
          if (err) return callback({ status: false, messages: err.stack });
          return callback({ status: true, answers: res.rows });
        });
      });
    }
  }, {
    key: 'delete',
    value: function _delete(id, callback) {
      var getQuery = {
        text: 'DELETE FROM answers WHERE id = $1',
        values: ['' + id]
      };

      _database2.default.connect(function (error, client, done) {
        if (error) return callback({ status: false, message: error.stack });
        return client.query(getQuery, function (err) {
          done();
          if (err) return callback({ status: false, messages: err.stack });
          return callback({ status: true, data: {} });
        });
      });
    }
  }, {
    key: 'empty',
    value: function empty(callback) {
      var emptyQuery = 'DELETE FROM answers';
      _database2.default.connect(function (error, client, done) {
        if (error) return callback(error);
        return client.query(emptyQuery, function (err) {
          done();
          return callback(err);
        });
      });
    }
  }]);

  return Answer;
}();

exports.default = Answer;