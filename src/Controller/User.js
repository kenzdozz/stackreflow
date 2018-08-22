
import { code } from '../config';
import User from '../Model/User';

function getUser(req, res) {
  return User.find(req.params.id, (data) => {
    if (!data.status) return res.status(code.serverError).json('Internal server error');
    if (!data.user) return res.status(code.notFound).json('User not found');
    return res.json(data);
  });
}

function getUsers(req, res) {
  return User.findAll((data) => {
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
