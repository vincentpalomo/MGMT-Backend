import express, { Request, Response, NextFunction } from 'express';
const usersRouter = express.Router();

// interface
interface User {
  username: string;
  password: string;
  avatar: string;
}

const { getAllUsers } = require('../db/models/users');

usersRouter.get('/all', async (req: Request, res: Response, next: NextFunction) => {
  const users: object = await getAllUsers();
  res.send(users);
});

module.exports = usersRouter;
