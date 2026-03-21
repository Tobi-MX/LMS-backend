import express from "express"
import { authenticate } from "../middleware/authenticate.middleware.js"
import { authorize } from "../middleware/authorize.middleware.js"
import { getInstructorCourseAnalytics } from "../controllers/analytics.controller.js"

const router = express.Router()

router.get("/courses/:courseId/analytics",
    authenticate,
    authorize("instructor"),
    getInstructorCourseAnalytics
)


export default router