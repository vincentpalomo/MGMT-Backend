import { config } from 'dotenv'
import express, { Request, Responst, NextFunction } from 'express'
import cors from 'cors'
import morgan from 'morgan'

// dotenv
config()

// setting up server
const app = express()

// middleware
app.use(express.json())
app.use(cors())
app.use(morgan('dev'))

app.get('/', (req: Request, res: Responst, next: NextFunction)  => {
  res.send('Server Online 🚀')
})

const apiRouter = require('./api')
app.use('/api', apiRouter)

const { client } = require('./db')

const PORT = 3000 || process.env

const handle = app.listen(PORT, async () => {
  try {
    await client.connect()
    console.log(`Server is running on http://localhost:${PORT}/ 🚀`)
  } catch (error) {
    console.log('Error server shutdown 😢')
    handle.close()
  }
})