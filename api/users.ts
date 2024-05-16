import express, { Request, Response, NextFunction } from 'express';
const usersRouter = express.Router();

// interface
interface User {
  username: string;
  password: string;
  avatar: string;
}

const { getAllUsers, getUserById, getUserByUsername, createUser } = require('../db/models/users');
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

// GET api/users/id/:user_id
usersRouter.get('/id/:user_id', async (req: Request, res: Response, next: NextFunction) => {
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

// GET api/users/username
usersRouter.get('/username/:username', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const username = req.params.username
    const user = await getUserByUsername(username)
    const trackedJobs = await getJobByUserID(user.id)

    user.jobs = trackedJobs
    
    res.json(user)
  } catch (error) {
    console.error('Error retreiving user by username', error)
    res.status(500).json({ error: 'Internal server error'})
  }
})

// POST api/users/register
usersRouter.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  const { username, password, avatar }: User = req.body

  const user = await createUser({
    username, password, avatar
  })

  res.send({
    message: 'Thank you for signing up! 😎',
    user
  })
})

module.exports = usersRouter;
