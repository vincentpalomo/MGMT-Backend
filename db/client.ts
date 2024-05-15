import { Client } from 'pg'
import { config } from 'dotenv'

config()
const DB_URL = process.env.database_url

let client = new Client({
  connectionString: DB_URL
})

module.exports = {
  client,
}