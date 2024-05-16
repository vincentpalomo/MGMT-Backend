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

// GET api/users/
usersRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  const users: object = await getAllUsers();
  res.send(users);
});

// GET api/users/user_id/jobs
usersRouter.get('/:user_id/jobs', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user_id = parseInt(req.params.user_id); // Parse user_id to integer
    const trackedJobs = await getJobByUserID(user_id);

    res.json(trackedJobs);
  } catch (error) {
    console.error('Error retrieving jobs for user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET api/users/user_id
usersRouter.get('/:user_id/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user_id = parseInt(req.params.user_id)
    const user = await getUserById(user_id)
    const trackedJobs = await getJobByUserID(user_id)

    user.jobs = trackedJobs

    res.json(user)
  } catch (error) {
    console.error('Error retrieving user by id', error)
    res.status(500).json({ error: 'Internal server error'})
  }
})

module.exports = usersRouter;
