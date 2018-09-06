import User from '../Model/User';
import { code, errMsg } from '../config';

function validate(req) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const msg = {};
  let status = true;

  if (!regex.test(req.body.email.trim())) {
    msg.email = 'A valid email address is required.';
    status = false;
  }
  if (req.body.name.trim() === '') {
    msg.name = 'Display name is required.';
    status = false;
  }
  if (req.body.password === '') {
    msg.password = 'Password is required.';
    status = false;
  }
  return {
    status,
    errors: msg,
  };
}

function createUser(req, res) {
  const valid = validate(req);
  if (!valid.status) return res.status(code.badRequest).json(valid);

  const user = new User();
  user.name = req.body.name.trim();
  user.email = req.body.email.trim();
  user.password = req.body.password;

  return user.save((data) => {
    if (!data.status) {
      return res.status(code.serverError).json({ status: false, errors: errMsg.serverError });
    }
    if (data.message === 'duplicate') {
      return res.status(code.conflict).json({ status: false, errors: { email: 'User already exists' } });
    }
    const aUser = data.user;
    delete aUser.password;
    return res.status(code.ok).json({ status: true, user: aUser });
  });
}

function registerRoutes(router) {
  router.post('/auth/signup', createUser);
}

export default registerRoutes;
