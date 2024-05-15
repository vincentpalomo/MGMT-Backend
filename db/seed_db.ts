import { client } from './client'
const { createUser } = require('./models/users')

async function dropTables() {
  try {
    console.log(`Dropping all tables...💀`)
    await client.query(`
    DROP TABLE IF EXISTS comments
    DROP TABLE IF EXISTS tags
    DROP TABLE IF EXISTS goals
    DROP TABLE IF EXISTS users
    `)
    console.log(`Finished dropping tables... 🙂`)
  } catch (error) {
    console.error(`Error dropping tables... 😒`)
  }
}

module.exports = {
  dropTables,
}