import express, { Request, Response, NextFunction } from 'express';
const jobsRouter = express.Router();

const { createJob, updateJob, getAllJobs, getJobByUserID } = require('../db/models/jobs');
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
    next(error);
  }
});

// PUT api/jobs/update/:job_id *admin
jobsRouter.put('/update/:job_id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const jobId = parseInt(req.params.job_id);
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

    // Call the updateJob function to update the job in the database
    const job = await updateJob({
      id: jobId,
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
      message: 'Job updated successfully 😊',
      job,
    });
  } catch (error) {
    console.error('Error updating job', error);
    next(error);
  }
});

// PUT api/jobs/update/:user_id/:job_id
jobsRouter.patch('/update/:user_id/:job_id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userID = parseInt(req.params.user_id);
    const jobID = parseInt(req.params.job_id);
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
      is_active,
    }: Job = req.body;

    // Check if the user_id from the URL matches the user_id in the request body
    if (userID !== req.body.user_id) {
      return res.status(403).json({ error: 'Unauthorized: User ID in URL does not match user ID in request body.' });
    }

    // Call the updateJob function to update the job in the database
    const job = await updateJob({
      id: jobID,
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
      user_id: userID,
      is_active,
    });

    res.send({
      message: 'Job updated successfully 😊',
      job,
    });
  } catch (error) {
    console.error('Error updating job', error);
    next(error);
  }
});

module.exports = jobsRouter;
