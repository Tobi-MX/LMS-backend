import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import { connectDB } from './config/db.js'
import { errorHandler } from './middleware/error.js'

import authRoutes from './routes/auth.route.js'
import courseRoutes from './routes/course.route.js'
import healthRoute from './routes/health.route.js'
import instructorRoutes from './routes/instructor.route.js'
import moduleRoutes from './routes/module.route.js'
import lessonRoutes from './routes/lesson.route.js'
import quizRoutes from './routes/quiz.route.js'
import usersRoutes from './routes/users.route.js'

import ENV from './config/env.js'

dotenv.config()

const app = express();
const PORT = ENV.PORT || 3000;


app.use(express.json()) // allows to parse incoming request body (don't FORGET again!)
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: [ENV.CLIENT_URL, "http://localhost:3000"].filter(Boolean),
  credentials: true
}))
app.use(cookieParser()) // allows to parse incoming cookies

app.use('/api/auth', authRoutes)
app.use('/api/courses', courseRoutes)
app.use('/api', healthRoute)
app.use('/api/instructor', instructorRoutes)
app.use('/api/modules', moduleRoutes)
app.use('/api/lessons', lessonRoutes)
app.use('/api/quizzes', quizRoutes)
app.use('/api/users', usersRoutes)

app.use(errorHandler)

connectDB().then(result => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})