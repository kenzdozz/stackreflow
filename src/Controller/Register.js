import User from '../Model/User';
import { code } from '../config';

function validate(user) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const msg = [];
  let status = true;

  if (!regex.test(user.email)) {
    msg.push('A valid email address is required.');
    status = false;
  }
  if (user.name === '') {
    msg.push('Display name is required.');
    status = false;
  }
  if (user.password === '') {
    msg.push('Password is required.');
    status = false;
  }
  return {
    status,
    message: JSON.stringify(msg),
  };
}

function createUser(req, res) {
  const user = new User();
  user.name = req.body.name.trim();
  user.email = req.body.email.trim();
  user.password = req.body.password;

  const valid = validate(user);

  if (!valid.status) return res.status(code.badRequest).json(valid);

  return user.save((data) => {
    if (!data.status) return res.status(code.serverError).json('Internal server error');
    if (data.message === 'duplicate') return res.status(code.conflict).json('User already exists');
    return res.status(code.ok).json(data);
  });
}

function registerRoutes(router) {
  router.post('/auth/signup', createUser);
}

export default registerRoutes;
