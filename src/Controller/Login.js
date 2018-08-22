import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { jwtSecret } from '../config';
import User from '../Model/User';

function validate(user) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const msg = [];
  let status = true;

  if (!regex.test(user.email)) {
    msg.push('A valid email address is required.');
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

function login(req, res) {
  const user = {
    email: req.body.email.trim(),
    password: req.body.password,
  };

  const valid = validate(user);

  if (!valid.status) {
    return res.json(valid);
  }

  return User.find(user.email, (data) => {
    if (!data.status) return res.status(500).json('Internal server error');
    if (data.user && data.user.password && bcrypt.compareSync(user.password, data.user.password)) {
      const token = jwt.sign({
        email: data.user.email,
        id: data.user.id,
      }, jwtSecret);
      return res.status(200).json(token);
    }
    return res.status(403).json('Invalid email or password.');
  });
}

function loginRoutes(router) {
  router.post('/auth/login', login);
}

export default loginRoutes;
