import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'

import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.route.js'

dotenv.config()

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()) // allows to parse incoming request body (don't FORGET again!)
app.use(cookieParser()) // allows to parse incoming cookies

app.use('/api/auth', authRoutes)

connectDB().then(result => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})