import express from 'express'
import { authenticate } from '../middleware/authenticate.middleware.js'
import { getStudentFeedback } from '../controllers/ai.controller.js'

const router = express.Router()

// student
router.post(
  "/courses/:courseId/feedback",
  authenticate,
  getStudentFeedback
)

export default router