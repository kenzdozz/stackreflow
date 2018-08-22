import * as User from '../Model/User';
import { code } from '../config';

function getUser(req, res) {
  return User.getUser(req.params.id, (data) => {
    if (!data.status) return res.status(code.serverError).json('Internal server error');
    if (!data.user) return res.status(code.notFound).json('User not found');
    return res.json(data);
  });
}

function getUsers(req, res) {
  return User.getUser((data) => {
    if (!data.status) return res.status(code.serverError).json('Internal server error');
    if (data.users.length < 1) return res.status(code.notFound).json('There are no users');
    return res.json(data);
  });
}

function userRoutes(router) {
  router.get('/user/:id', getUser);
  router.get('/users', getUsers);
}

export default userRoutes;
