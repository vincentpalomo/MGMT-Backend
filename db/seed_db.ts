import { client } from './client';
// const client = require('./client')
const { createUser } = require('./models/users');

// drop all tables before seeding
async function dropTables() {
  try {
    console.log(`Dropping all tables...💀`);
    await client.query(`
    DROP TABLE IF EXISTS comments
    DROP TABLE IF EXISTS tags
    DROP TABLE IF EXISTS jobs
    DROP TABLE IF EXISTS users
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
        isActive BOOLEAN DEFAULT true
      );
    `);
    console.log('Finished creating tables... ✅');
  } catch (error) {
    console.error('Error creating tables... 💢');
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

// function to rebuildDB
async function rebuildDB() {
  try {
    console.log('initializing client 👀');
    client.connect();
    console.log('client initialized 🚀');
    await dropTables();
    await createTables();
    await createInitialUsers();
    client.end();
  } catch (error) {
    console.error('Error rebuilding DB', error);
  }
}

rebuildDB();

module.exports = {
  rebuildDB,
  dropTables,
};
