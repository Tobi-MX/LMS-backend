import express from 'express'
import { authenticate } from '../middleware/authenticate.middleware.js'
import { getStudentFeedback, generateCourseSuggestions } from '../controllers/ai.controller.js'
import { authorize } from '../middleware/authorize.middleware.js'

const router = express.Router()

// student
router.post(
    "/courses/:courseId/feedback",
    authenticate,
    getStudentFeedback
)

// instructor
router.post(
    "/courses/:courseId/suggestions",
    authenticate,
    authorize("instructor"),
    generateCourseSuggestions
)

export default router