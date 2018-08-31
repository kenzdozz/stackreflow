'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _database = require('./database');

var _database2 = _interopRequireDefault(_database);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var question = Symbol('private');

var Question = function () {
  function Question() {
    _classCallCheck(this, Question);

    this[question] = {};
  }

  _createClass(Question, [{
    key: 'save',
    value: function save(callback) {
      var insertQuery = {
        text: 'INSERT INTO questions (user_id, title, body, tags) VALUES ($1, $2, $3, $4)',
        values: ['' + this[question].userId, '' + this[question].title, '' + this[question].body, '' + this[question].tags]
      };

      _database2.default.connect(function (error, client, done) {
        if (error) return callback({ status: false, message: error.stack });
        return client.query(insertQuery, function (err) {
          done();
          if (err) return callback({ status: false, messages: err.stack });
          return Question.find(0, callback);
        });
      });
    }
  }, {
    key: 'userId',
    set: function set(userId) {
      this[question].userId = userId;
    }
  }, {
    key: 'title',
    set: function set(title) {
      this[question].title = title;
    }
  }, {
    key: 'body',
    set: function set(body) {
      this[question].body = body;
    }
  }, {
    key: 'tags',
    set: function set(tags) {
      this[question].tags = tags;
    }
  }], [{
    key: 'createTable',
    value: function createTable(callback) {
      var createTableQuery = 'CREATE TABLE IF NOT EXISTS questions (' + ' id SERIAL PRIMARY KEY,' + ' user_id integer REFERENCES users(id) ON DELETE CASCADE,' + ' title varchar(100),' + ' body varchar(3000),' + ' tags varchar(255) NULL,' + ' answer_count integer DEFAULT 0,' + ' createdAt date DEFAULT CURRENT_TIMESTAMP,' + ' updatedAt date DEFAULT CURRENT_TIMESTAMP );';

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
        text: 'SELECT * FROM questions WHERE id = $1',
        values: ['' + id]
      };

      if (!id) getQuery = 'SELECT * FROM questions ORDER BY id DESC LIMIT 1';

      _database2.default.connect(function (error, client, done) {
        if (error) return callback({ status: false, message: error.stack });
        return client.query(getQuery, function (err, res) {
          done();
          if (err) return callback({ status: false, messages: err.stack });
          return callback({ status: true, question: res.rows[0] });
        });
      });
    }
  }, {
    key: 'update',
    value: function update(id, aQuestion, callback) {
      var i = 0;
      var values = [];
      var set = '';
      if (aQuestion.title) {
        set += 'title = $' + (i += 1) + ' ';
        values.push(aQuestion.title);
      }
      if (aQuestion.body) {
        set += 'body = $' + (i += 1) + ' ';
        values.push(aQuestion.body);
      }
      if (aQuestion.tags) {
        set += 'tags = $' + (i += 1) + ' ';
        values.push(aQuestion.tags);
      }
      values.push(id);

      var updateQuery = {
        text: 'UPDATE questions SET ' + set + ' WHERE id = $' + (i += 1),
        values: values
      };

      _database2.default.connect(function (error, client, done) {
        if (error) return callback({ status: false, message: error.stack });
        return client.query(updateQuery, function (err) {
          done();
          if (err) return callback({ status: false, messages: err.stack });
          return Question.find(id, callback);
        });
      });
    }
  }, {
    key: 'findAll',
    value: function findAll(callback) {
      var getQuery = 'SELECT * FROM questions ORDER BY createdAt';

      _database2.default.connect(function (error, client, done) {
        if (error) return callback({ status: false, message: error.stack });
        return client.query(getQuery, function (err, res) {
          done();
          if (err) return callback({ status: false, messages: err.stack });
          return callback({ status: true, questions: res.rows });
        });
      });
    }
  }, {
    key: 'findForUser',
    value: function findForUser(id, callback) {
      var getQuery = {
        text: 'SELECT * FROM questions WHERE user_id = $1',
        values: ['' + id]
      };

      _database2.default.connect(function (error, client, done) {
        if (error) return callback({ status: false, message: error.stack });
        return client.query(getQuery, function (err, res) {
          done();
          if (err) return callback({ status: false, messages: err.stack });
          return callback({ status: true, questions: res.rows });
        });
      });
    }
  }, {
    key: 'delete',
    value: function _delete(id, callback) {
      var getQuery = {
        text: 'DELETE FROM questions WHERE id = $1',
        values: ['' + id]
      };

      _database2.default.connect(function (error, client, done) {
        if (error) return callback({ status: false, message: error.stack });
        return client.query(getQuery, function (err) {
          done();
          if (err) return callback({ status: false, messages: err.stack });
          return callback({ status: true, question: {} });
        });
      });
    }
  }, {
    key: 'empty',
    value: function empty(callback) {
      var emptyQuery = 'DELETE FROM questions';
      _database2.default.connect(function (error, client, done) {
        if (error) return callback(error);
        return client.query(emptyQuery, function (err) {
          done();
          return callback(err);
        });
      });
    }
  }]);

  return Question;
}();

exports.default = Question;