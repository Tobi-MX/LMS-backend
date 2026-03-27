import express from "express"
import { authenticate } from "../middleware/authenticate.middleware.js"
import { authorize } from "../middleware/authorize.middleware.js"
import { getInstructorCourseAnalytics, getInstructorQuizAnalytics, getStudentAnalytics, getAdminAnalytics } from "../controllers/analytics.controller.js"
import { isVerifiedAndApproved } from "../middleware/verifiedAndApproved.js"

const router = express.Router()


// INSTRUCTORS
router.get("/instructor/courses/:courseId",
    authenticate,
    isVerifiedAndApproved,
    authorize("instructor"),
    getInstructorCourseAnalytics
)

router.get("/instructor/quizzes/:quizId",
    authenticate,
    isVerifiedAndApproved,
    authorize("instructor"),
    getInstructorQuizAnalytics
)

// STUDENTS
router.get("/me",
    authenticate,
    isVerifiedAndApproved,
    getStudentAnalytics
)

// ADMIN
router.get("/admin",
    authenticate,
    isVerifiedAndApproved,
    authorize("admin"),
    getAdminAnalytics
)

export default router