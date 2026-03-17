import express from 'express'
import { upload } from '../lib/multer.js'

import { authenticate } from "../middleware/authenticate.middleware.js"
import { updateMyProfile, getMyProfile } from '../controllers/user.controller.js'
import { getEnrolledCourses } from '../controllers/enrollment.controller.js'

const router = express.Router()

router.use(authenticate)

router.patch("/me", upload.single("profilePic"), updateMyProfile)
router.get("/me", getMyProfile)

// Enrollment Controller
router.get("/me/courses", getEnrolledCourses)

export default router