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
  interview_date: string | number | null;
  interview_type: string;
  salary: number;
  follow_up: string | boolean | [];
  notes: string;
  user_id: number;
  is_active: boolean | null;
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
    if (is_active == null) is_active = true;

    if (interview_date == '') interview_date = null;

    if (follow_up == '') follow_up = [];

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

// update job
const updateJob = async ({
  id,
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
    const query = `
    UPDATE jobs
    SET title = $1,
        company_name = $2,
        jobURL = $3,
        location = $4,
        date_applied = $5,
        application_status = $6,
        interview_date = $7,
        interview_type = $8,
        salary = $9,
        follow_up = $10,
        notes = $11,
        user_id = $12,
        is_active = $13,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $14
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
      id,
    ];

    const {
      rows: [job],
    } = await client.query(query, values);

    return job;
  } catch (error) {
    console.error('Error updating job:', error);
    throw error; // Rethrow the error to be caught by the caller
  }
};

// delete job
const deleteJob = async (jobId: number) => {
  try {
    const query = `
    DELETE FROM jobs
    WHERE id = $1
    RETURNING *;
    `;
    const values = [jobId];

    const {
      rows: [deletedJob],
    } = await client.query(query, values);

    return deletedJob;
  } catch (error) {
    console.error('Error deleting job from DB', error);
    throw error;
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
  updateJob,
  deleteJob,
  getAllJobs,
  getJobByUserID,
};
