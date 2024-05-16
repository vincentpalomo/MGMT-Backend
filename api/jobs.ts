import express, { Request, Response, NextFunction } from 'express';
const jobsRouter = express.Router();

const { createJob, getAllJobs, getJobByUserID } = require('../db/models/jobs');
const { getUserById } = require('../db/models/users');

// interface
interface Job {
  title: string;
  company_name: string;
  jobURL: string;
  location: string;
  date_applied: string;
  application_status: string;
  interview_date: string;
  interview_type: string;
  salary: string;
  follow_up: string;
  notes: [];
  user_id: number;
  is_active: boolean;
}

// GET api/jobs/
jobsRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  const jobs = await getAllJobs();
  res.send(jobs);
});

// GET api/jobs/user/:user_id
jobsRouter.get('/user/:user_id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userID = parseInt(req.params.user_id);
    const user = await getUserById(userID);

    if (!user) return res.send(`User: ${userID} does not exist 😥`);

    const trackedJobs = await getJobByUserID(userID);

    user.jobs = trackedJobs;

    if (user.jobs.length === 0) return res.send(`No current jobs with this user 😥`);

    res.send(user);
  } catch (error) {}
});

// POST api/jobs/create/:user_id
jobsRouter.post('/create/:user_id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      title,
      company_name,
      jobURL,
      location,
      date_applied,
      application_status,
      interview_date,
      interview_type,
      salary,
      follow_up,
      notes,
      user_id,
      is_active,
    }: Job = req.body;

    const job = await createJob({
      title,
      company_name,
      jobURL,
      location,
      date_applied,
      application_status,
      interview_date,
      interview_type,
      salary,
      follow_up,
      notes,
      user_id,
      is_active,
    });

    res.send({
      message: 'Job application added! 😊',
      job,
    });
  } catch (error) {
    console.error('Error creating job', error);
  }
});

module.exports = jobsRouter;
