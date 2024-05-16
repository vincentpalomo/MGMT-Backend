import { client } from '../client';

// interface
interface Jobs {
  id: number;
  title: string;
  company_name: string;
  jobURL: string;
  location: string;
  date_applied: number;
  application_status: boolean;
  interview_date: number;
  interview_type: string;
  salary: number;
  follow_up: boolean;
  notes: string;
  user_id: number;
  is_active: boolean;
}

// create jobs
const createJob = async ({
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
}: Jobs) => {
  try {
    console.log(user_id);
    const query = `
    INSERT INTO jobs (title, company_name, jobURL, location, date_applied, application_status, interview_date, interview_type, salary, follow_up, notes, user_id, is_active, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    RETURNING *;
    `;
    const values = [
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
    ];

    const {
      rows: [job],
    } = await client.query(query, values);

    return job;
  } catch (error) {
    console.error('Error creating job:', error);
    throw error; // Rethrow the error to be caught by the caller
  }
};

// get all jobs
const getAllJobs = async () => {
  try {
    const { rows: jobs } = await client.query(`
    SELECT * FROM jobs
    `);

    return jobs;
  } catch (error) {
    console.error('Error retreiving jobs from DB', error);
  }
};

// get job by user id
const getJobByUserID = async (user_id: number) => {
  const job = await getAllJobs();

  return job?.filter((j) => j.user_id === user_id);
};

module.exports = {
  createJob,
  getAllJobs,
  getJobByUserID,
};
