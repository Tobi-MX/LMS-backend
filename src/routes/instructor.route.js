import express from "express"
import { authenticate } from "../middleware/authenticate.middleware.js"
import { authorize } from "../middleware/authorize.middleware.js"
import { getInstructorCourseAnalytics, getInstructorQuizAnalytics } from "../controllers/analytics.controller.js"

const router = express.Router()

router.get("/courses/:courseId/analytics",
    authenticate,
    authorize("instructor"),
    getInstructorCourseAnalytics
)

router.get("/quizzes/:quizId/analytics",
    authenticate,
    authorize("instructor"),
    getInstructorQuizAnalytics
)


export default router