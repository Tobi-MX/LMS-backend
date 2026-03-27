import express from 'express'
import { authenticate } from '../middleware/authenticate.middleware.js'
import { getStudentFeedback, generateCourseSuggestions, generateQuiz } from '../controllers/ai.controller.js'
import { authorize } from '../middleware/authorize.middleware.js'
import { isVerifiedAndApproved } from '../middleware/verifiedAndApproved.js'

const router = express.Router()

// student
router.post(
    "/courses/:courseId/feedback",
    authenticate,
    isVerifiedAndApproved,
    getStudentFeedback
)

// instructor
router.post(
    "/courses/:courseId/suggestions",
    authenticate,
    isVerifiedAndApproved,
    authorize("instructor"),
    generateCourseSuggestions
)

router.post(
    "/lessons/:lessonId/generate-quiz",
    authenticate,
    isVerifiedAndApproved,
    authorize("instructor"),
    generateQuiz
)

export default router