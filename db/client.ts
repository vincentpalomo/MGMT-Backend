import { Client } from 'pg'
import { config } from 'dotenv'

config()
const DB_URL = process.env.DATABASE_URL

export let client: Client;

try {
  client = new Client({
    connectionString: DB_URL
  })      
} catch (error) {
  console.error('Error creating PostgreSQL client:', error)
  process.exit(1)
}

module.exports = { client };