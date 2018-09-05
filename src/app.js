import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import registerRoutes from './Controller/Register';
import userRoutes from './Controller/User';
import loginRoutes from './Controller/Login';
import { jwtSecret, code } from './config';
import questionRoutes from './Controller/Question';
import answerRoutes from './Controller/Answer';
import User from './Model/User';
import Question from './Model/Question';
import Answer from './Model/Answer';
import Vote from './Model/Vote';
import path from 'path';

const app = express();
app.use(cookieParser());
const apiRouter = express.Router();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname + '/public')));

app.use((req, res, next) => {
  res.locals.user = {};
  const token = req.body.token || req.query.token || req.headers['x-access-token'] || 'none';
  return jwt.verify(token, jwtSecret, (err, data) => {
    if (err) {
      if (req.method === 'GET' || req.path === '/api/v1/auth/login' || req.path === '/api/v1/auth/signup') {
        res.locals.authCheck = false;
        return next();
      }
      return res.status(code.unAuthorized)
        .json({ status: false, errors: 'Unauthorized Access - invalid or no token' });
    }
    res.locals.user = data;
    res.locals.authCheck = true;
    return next();
  });
});

Vote.createTable(() => {});
User.createTable(() => { });
Question.createTable(() => { });
Answer.createTable(() => { });

app.use('/api/v1', apiRouter);
registerRoutes(apiRouter);
userRoutes(apiRouter);
loginRoutes(apiRouter);
questionRoutes(apiRouter);
answerRoutes(apiRouter);

// viewed at http://localhost:8080
app.listen(3033);

export default app;
