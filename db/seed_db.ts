import { client } from './client';
// const client = require('./client')
const { createUser } = require('./models/users');
const { createJob } = require('./models/jobs');

// drop all tables before seeding
async function dropTables() {
  try {
    console.log(`Dropping all tables...💀`);
    await client.query(`
    DROP TABLE IF EXISTS jobs;
    DROP TABLE IF EXISTS users;
    `);
    console.log(`Finished dropping tables... 🙂`);
  } catch (error) {
    console.error(`Error dropping tables... 😒`);
  }
}

// create tables
async function createTables() {
  try {
    console.log('Starting to build tables... 💫');
    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(225) UNIQUE NOT NULL,
        password VARCHAR(225) NOT NULL,
        avatar TEXT,
        is_active BOOLEAN DEFAULT true
      );

      CREATE TABLE jobs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        company_name VARCHAR(255) NOT NULL,
        jobURL VARCHAR(255) NOT NULL,
        location VARCHAR(255),
        date_applied DATE,
        application_status VARCHAR(100),
        interview_date DATE,
        interview_type VARCHAR(100),
        salary VARCHAR(100),
        follow_up TEXT[],
        notes TEXT,
        "user_id" INTEGER REFERENCES users(id),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Finished creating tables... ✅');
  } catch (error) {
    console.error('Error creating tables... 💢', error);
  }
}

// create initial test users
const createInitialUsers = async () => {
  try {
    console.log('Creating users... 💫');
    const initialUsers = [
      {
        username: 'test',
        password: '1234',
        avatar: 'no image',
      },
      {
        username: 'jinx',
        password: 'bestbb',
        avatar: 'no image',
      },
    ];

    const createNewUser = await Promise.all(initialUsers.map(createUser));
    console.log(createNewUser);
    console.log('Finished creating users... ✅');
  } catch (error) {
    console.error('Error creating users... 💢');
  }
};

// create initial test job
const createInitialJobs = async () => {
  try {
    console.log('Creating initial jobs... 💼');

    const initialJobs = [
      {
        title: 'Software Engineer',
        company_name: 'Acme Corporation',
        jobURL: 'https://acme.example.com/job/123',
        location: 'New York',
        date_applied: '2024-05-15',
        application_status: 'Applied',
        interview_date: null,
        interview_type: null,
        salary: '$80,000 - $100,000 per year',
        follow_up: ['Email HR', 'Follow up on LinkedIn'],
        notes: 'This is a sample job posting for a software engineer position at Acme Corporation.',
        user_id: 1,
        is_active: true,
      },
      {
        title: 'Data Scientist',
        company_name: 'Tech Innovations Inc.',
        jobURL: 'https://techinnovations.example.com/job/456',
        location: 'San Francisco',
        date_applied: '2024-05-20',
        application_status: 'In Review',
        interview_date: null,
        interview_type: null,
        salary: '$90,000 - $120,000 per year',
        follow_up: ['Follow up email to HR'],
        notes: 'Exciting opportunity to work on cutting-edge machine learning projects.',
        user_id: 1, // Assuming the user ID of the applicant is 2
        is_active: true,
      },
      {
        title: 'Marketing Manager',
        company_name: 'Global Marketing Agency',
        jobURL: 'https://globalmarketing.example.com/job/789',
        location: 'London',
        date_applied: '2024-05-25',
        application_status: 'Pending',
        interview_date: null,
        interview_type: null,
        salary: '£50,000 - £60,000 per year',
        follow_up: [],
        notes: 'Seeking an experienced marketing professional to lead innovative campaigns.',
        user_id: 2, // Assuming the user ID of the applicant is 3
        is_active: true,
      },
    ];
    const createNewJobs = await Promise.all(initialJobs.map(createJob));
    console.log(createNewJobs);
    console.log('Finished creating initial jobs... ✅');
  } catch (error) {
    console.error('Error creating initial jobs... 💢', error);
  }
};

// function to rebuildDB
async function rebuildDB() {
  try {
    console.log('initializing client 👀');
    client.connect();
    console.log('client initialized 🚀');
    await dropTables();
    await createTables();
    await createInitialUsers();
    await createInitialJobs();
    client.end();
  } catch (error) {
    console.error('Error rebuilding DB 💀', error);
  }
}

rebuildDB();

module.exports = {
  rebuildDB,
  dropTables,
};
