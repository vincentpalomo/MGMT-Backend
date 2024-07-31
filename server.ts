import { config } from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';

// dotenv
config();

// setting up server
const app = express();

// middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('Server Online & Healthy 🟢');
});

const apiRouter = require('./api');
app.use('/api', apiRouter);

const { client } = require('./db/client');

export const PORT = 4000 || process.env.PORT;

const handle = app.listen(PORT, '0.0.0.0', async () => {
  try {
    await client.connect();
    console.log(`Server is running on http://0.0.0.0:${PORT}/ 🚀 API http://0.0.0.0:${PORT}/api 🌐`);
  } catch (error) {
    console.log('Error server shutdown 😢');
    handle.close();
  }
});

module.exports = { app };
