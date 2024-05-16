import express, { Request, Response, NextFunction } from 'express';
const apiRouter = express.Router();
import { PORT } from '../server';

// server health
apiRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send({
    message: 'Server is online 🟢',
    users: `Users Route: http://localhost:${PORT}/api/users | https://mgmt-ymsn.onrender.com/api/users`,
    jobs: `Jobs Route: http://localhost:${PORT}/api/jobs | https://mgmt-ymsn.onrender.com/api/jobs`,
  });
});

// routers
const usersRouter = require('./users');
apiRouter.use('/users', usersRouter);

const jobsRouter = require('./jobs');
apiRouter.use('/jobs', jobsRouter);

module.exports = apiRouter;
