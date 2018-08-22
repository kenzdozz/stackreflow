'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _database = require('./database');

var _database2 = _interopRequireDefault(_database);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var user = Symbol('private');

var User = function () {
  function User() {
    _classCallCheck(this, User);

    this[user] = {};
  }

  _createClass(User, [{
    key: 'save',
    value: function save(callback) {
      var _this = this;

      var password = _bcrypt2.default.hashSync(this[user].password, 10);
      var insertQuery = {
        text: 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
        values: ['' + this[user].name, '' + this[user].email, '' + password]
      };

      _database2.default.connect(function (error, client, done) {
        if (error) return callback({ status: false, message: error.stack });
        return client.query(insertQuery, function (err) {
          done();
          var msg = err.constraint === 'users_email_key' ? 'duplicate' : err.stack;
          if (err) return callback({ status: false, messages: msg });
          return User.find(_this[user].email, callback);
        });
      });
    }
  }, {
    key: 'name',
    set: function set(newName) {
      this[user].name = newName;
    }
  }, {
    key: 'email',
    set: function set(newEmail) {
      this[user].email = newEmail;
    }
  }, {
    key: 'password',
    set: function set(newPassword) {
      this[user].password = newPassword;
    }
  }], [{
    key: 'createTable',
    value: function createTable(callback) {
      var createTableQuery = 'CREATE TABLE IF NOT EXISTS users (' + ' id SERIAL PRIMARY KEY,' + ' name varchar(100),' + ' email varchar(100) UNIQUE,' + ' password varchar(255),' + ' createdAt date DEFAULT CURRENT_TIMESTAMP,' + ' updatedAt date DEFAULT CURRENT_TIMESTAMP );';

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
      var isEmail = Number.isNaN(parseInt(id, 10));
      var where = isEmail ? 'LOWER(email) = LOWER($1)' : 'id = $1';
      var getQuery = {
        text: 'SELECT * FROM users WHERE ' + where,
        values: ['' + id]
      };

      _database2.default.connect(function (error, client, done) {
        if (error) return callback({ status: false, message: error.stack });
        return client.query(getQuery, function (err, res) {
          done();
          if (err) return callback({ status: false, messages: err.stack });
          return callback({ status: true, user: res.rows[0] });
        });
      });
    }
  }, {
    key: 'update',
    value: function update(id, aUser, callback) {
      var i = 0;
      var values = [];
      var set = void 0;var password = '';
      if (aUser.name) {
        set = 'name = ' + (i += 1);
        values.push(aUser.name);
      }
      if (aUser.email) {
        set = 'email = ' + (i += 1);
        values.push(aUser.email);
      }
      if (aUser.password) {
        password = _bcrypt2.default.hashSync(aUser.password, 10);
        set = 'password = ' + (i += 1);
        values.push(password);
      }
      values.push(id);

      var updateQuery = {
        text: 'UPDATE users SET ' + set + ' WHERE id = $' + i,
        values: values
      };

      _database2.default.connect(function (error, client, done) {
        if (error) return callback({ status: false, message: error.stack });
        return client.query(updateQuery, function (err) {
          done();
          if (err) return callback({ status: false, messages: err.stack });
          return User.find(aUser.email, callback);
        });
      });
    }
  }, {
    key: 'findAll',
    value: function findAll(callback) {
      var getQuery = 'SELECT * FROM users ORDER BY createdAt';

      _database2.default.connect(function (error, client, done) {
        if (error) return callback({ status: false, message: error.stack });
        return client.query(getQuery, function (err, res) {
          done();
          if (err) return callback({ status: false, messages: err.stack });
          return callback({ status: true, users: res.rows });
        });
      });
    }
  }]);

  return User;
}();

exports.default = User;