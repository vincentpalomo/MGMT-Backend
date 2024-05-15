import express, { Request, Response, NextFunction } from 'express';
const usersRouter = express.Router();

// interface
interface User {
  username: string;
  password: string;
  avatar: string;
}

const { getAllUsers, getUserById } = require('../db/models/users');
const { getJobByUserID } = require('../db/models/jobs');

usersRouter.get('/all', async (req: Request, res: Response, next: NextFunction) => {
  const users: object = await getAllUsers();
  res.send(users);
});

usersRouter.get('/:user_id/jobs', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user_id = parseInt(req.params.user_id); // Parse user_id to integer
    const jobsForUser = await getJobByUserID(user_id);

    res.json(jobsForUser);
  } catch (error) {
    console.error('Error retrieving jobs for user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = usersRouter;
