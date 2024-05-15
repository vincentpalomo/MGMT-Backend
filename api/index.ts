import express, { Request, Response, NextFunction } from 'express';
const apiRouter = express.Router();

// server health
apiRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send({
    message: 'Server is online 🟢',
  });
});

// routers
const usersRouter = require('./users');
apiRouter.use('/users', usersRouter);

module.exports = apiRouter;
