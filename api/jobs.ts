import express, { Request, Response, NextFunction } from 'express';
const jobsRouter = express.Router();

const { createJob, getAllJobs, getJobByUserID } = require('../db/models/jobs');

// GET api/jobs/
jobsRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  const jobs = await getAllJobs();
  res.send(jobs);
});

jobsRouter.get('/');

module.exports = jobsRouter;
