import * as User from '../Model/User';

function getUser(req, res) {
  return User.getUser(req.params.id, data => res.json(data));
}

function userRoutes(router) {
  router.get('/user/:id', getUser);
}

export default userRoutes;
