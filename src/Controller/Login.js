import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { jwtSecret, code, errMsg } from '../config';
import User from '../Model/User';

function validate(user) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const msg = {};
  let status = true;

  if (!regex.test(user.email)) {
    msg.email = 'A valid email address is required.';
    status = false;
  }
  if (user.password === '') {
    msg.password = 'Password is required.';
    status = false;
  }
  return {
    status,
    errors: msg,
  };
}

function login(req, res) {
  const user = {
    email: req.body.email.trim(),
    password: req.body.password,
  };

  const valid = validate(user);

  if (!valid.status) {
    return res.status(code.badRequest).json(valid);
  }

  return User.find(user.email, (data) => {
    if (!data.status) {
      return res.status(code.serverError).json({ status: false, errors: errMsg.serverError });
    }
    if (data.user && data.user.password && bcrypt.compareSync(user.password, data.user.password)) {
      const token = jwt.sign({
        email: data.user.email,
        id: data.user.id,
      }, jwtSecret);
      const aUser = data.user;
      delete aUser.password;
      return res.status(code.ok).json({ status: true, token, user: aUser });
    }
    return res.status(code.badRequest).json({ status: false, errors: { email: 'Invalid email or password.' } });
  });
}

function loginRoutes(router) {
  router.post('/auth/login', login);
}

export default loginRoutes;
