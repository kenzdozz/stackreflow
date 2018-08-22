'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _User = require('../Model/User');

var User = _interopRequireWildcard(_User);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function getUser(req, res) {
  return User.getUser(req.params.id, function (data) {
    return res.json(data);
  });
}

function userRoutes(router) {
  router.get('/user/:id', getUser);
}

exports.default = userRoutes;