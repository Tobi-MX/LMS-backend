import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'
import cors from 'cors'

import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.route.js'
import courseRoutes from './routes/course.route.js'
import ENV from './config/env.js';

dotenv.config()

const app = express();
const PORT = ENV.PORT || 3000;

app.use(express.json()) // allows to parse incoming request body (don't FORGET again!)
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }))
app.use(cookieParser()) // allows to parse incoming cookies

app.use('/api/auth', authRoutes)
app.use('/api/courses', courseRoutes)

connectDB().then(result => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})