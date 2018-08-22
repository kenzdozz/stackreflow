import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import registerRoutes from './Controller/Register';
import userRoutes from './Controller/User';
import loginRoutes from './Controller/Login';
import { jwtSecret, code } from './config';
import questionRoutes from './Controller/Question';

const app = express();
const apiRouter = express.Router();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const user = {};
app.use('/api/v1/questions', (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (!token) return res.status(code.unAuthorized).json('Unauthorized Access - no token');
  return jwt.verify(token, jwtSecret, (err, data) => {
    if (err) return res.status(code.unAuthorized).json('Unauthorized Access - invalid token');
    res.locals.user = data;
    return next();
  });
});

app.use('/api/v1', apiRouter);
registerRoutes(apiRouter);
userRoutes(apiRouter);
loginRoutes(apiRouter);
questionRoutes(apiRouter, user);

app.listen(3033);
