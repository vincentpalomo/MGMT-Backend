import express, { Request, Response, NextFunction } from 'express';
const usersRouter = express.Router();

// interface
interface User {
  username: string;
  password: string;
  email: string;
  avatar: string;
}

const {
  getAllUsers,
  getUserById,
  getUserByUsername,
  createUser,
  updateUser,
  deleteUser,
  activateUser,
} = require('../db/models/users');
const { getJobByUserID } = require('../db/models/jobs');

// GET api/users/
usersRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  const users: object = await getAllUsers();
  res.send(users);
});

// GET api/users/jobs/:user_id
usersRouter.get('/jobs/:user_id/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user_id = parseInt(req.params.user_id); // Parse user_id to integer
    const trackedJobs = await getJobByUserID(user_id);

    if (trackedJobs.length === 0) return res.json(`No jobs found from user: ${user_id}`);

    res.json(trackedJobs);
  } catch (error) {
    console.error('Error retrieving jobs for user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET api/users/id/:user_id
usersRouter.get('/id/:user_id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user_id = parseInt(req.params.user_id);
    const user = await getUserById(user_id);

    if (!user) return res.json(`No user id: ${user_id} found`);

    const trackedJobs = await getJobByUserID(user_id);

    user.jobs = trackedJobs;

    res.json(user);
  } catch (error) {
    console.error('Error retrieving user by id', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET api/users/username
usersRouter.get('/username/:username', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const username = req.params.username;
    const user = await getUserByUsername(username);

    if (!user) return res.json(`No user named: [${username}] found.`);

    const trackedJobs = await getJobByUserID(user.id);

    user.jobs = trackedJobs;

    res.json(user);
  } catch (error) {
    console.error('Error retreiving user by username', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST api/users/register
usersRouter.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  const { username, password, email, avatar }: User = req.body;

  const user = await createUser({
    username,
    password,
    email,
    avatar,
  });

  res.send({
    message: 'Thank you for signing up! 😎',
    user,
  });
});

// PATCH api/users/edit/:user_id
usersRouter.patch('/edit/:user_id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password, email, avatar }: User = req.body;
    const userID = parseInt(req.params.user_id);
    const user = await getUserById(userID);

    if (!user) return res.send(`Forbidden Access`);

    const fields = {
      username: username,
      password: password,
      email: email,
      avatar: avatar,
    };

    const userUpdate = await updateUser(user.id, fields);

    res.send({
      message: `Profile updated successfully! ✌️`,
      userUpdate,
    });
  } catch (error) {}
});

// DELETE api/users/deactivate/:user_id
usersRouter.delete('/deactivate/:user_id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userID = parseInt(req.params.user_id);
    const checkUser = await getUserById(userID);

    if (!checkUser) {
      next({
        name: `UserNotFoundError`,
        message: `User does not exist with id: ${userID} 🤔`,
      });
    }

    const deletedUser = await deleteUser(userID);
    res.send({
      message: 'User Deactivated',
      deletedUser,
    });
  } catch (error) {
    console.error(`error deleting user endpoint`, error);
    next(error);
  }
});

// PATCH api/users/activate/:user_id
usersRouter.patch('/activate/:user_id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userID = parseInt(req.params.user_id);
    const checkUser = await getUserById(userID);

    if (!checkUser) {
      next({
        name: `UserNotFoundError`,
        message: `User does not exist with id: ${userID} 🤔`,
      });
    }

    const activate = await activateUser(userID);

    res.send({
      message: 'User Activated',
      activate,
    });
  } catch (error) {}
});

module.exports = usersRouter;
