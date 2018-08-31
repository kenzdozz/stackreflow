
import { code, errMsg } from '../config';
import User from '../Model/User';

function getUser(req, res) {
  return User.find(req.params.id, (data) => {
    if (!data.status) {
      return res.status(code.serverError).json({ status: false, errors: errMsg.serverError });
    }
    if (!data.user) {
      return res.status(code.notFound).json({ status: false, errors: 'User not found' });
    }
    return res.status(code.ok).json(data);
  });
}

function getUsers(req, res) {
  return User.findAll((data) => {
    if (!data.status) {
      return res.status(code.serverError).json({ status: false, errors: errMsg.serverError });
    }
    if (data.users.length < 1) {
      return res.status(code.notFound).json({ status: false, errors: 'There are no users' });
    }
    return res.status(code.ok).json(data);
  });
}

function userRoutes(router) {
  router.get('/users/:id', getUser);
  router.get('/users', getUsers);
}

export default userRoutes;
