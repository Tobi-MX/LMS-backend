import express from 'express'
import { upload } from '../lib/multer.js'

import { authenticate } from "../middleware/authenticate.middleware.js"
import { updateMyProfile, getMyProfile, getUserProfile, deleteAccount } from '../controllers/user.controller.js'
import { getEnrolledCourses } from '../controllers/enrollment.controller.js'
import { isVerifiedAndApproved } from '../middleware/verifiedAndApproved.js'

const router = express.Router()

router.patch("/me", 
    upload.single("profilePic"),
    authenticate,
    isVerifiedAndApproved, 
    updateMyProfile
)

router.get("/me", 
    authenticate,
    isVerifiedAndApproved, 
    getMyProfile
)

router.get("/:id", 
    authenticate,
    isVerifiedAndApproved, 
    getUserProfile
)

router.delete("/me",
    authenticate,
    isVerifiedAndApproved,
    deleteAccount
)

// Enrollment Controller
router.get("/me/courses", 
    authenticate, 
    isVerifiedAndApproved, 
    getEnrolledCourses
)

export default router