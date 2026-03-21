import express from "express"
import { authenticate } from "../middleware/authenticate.middleware.js"
import { authorize } from "../middleware/authorize.middleware.js"
import { getInstructorCourseAnalytics, getInstructorQuizAnalytics, getStudentAnalytics, getAdminAnalytics } from "../controllers/analytics.controller.js"

const router = express.Router()


// INSTRUCTORS
router.get("/instructor/courses/:courseId",
    authenticate,
    authorize("instructor"),
    getInstructorCourseAnalytics
)

router.get("/instructor/quizzes/:quizId",
    authenticate,
    authorize("instructor"),
    getInstructorQuizAnalytics
)

// STUDENTS
router.get("/me",
    authenticate,
    getStudentAnalytics
)

// ADMIN
router.get("/admin",
    authenticate,
    authorize("admin"),
    getAdminAnalytics
)

export default router