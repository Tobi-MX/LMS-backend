import express from 'express'

import { getModule, updateModule, deleteModule } from '../controllers/module.controller.js'
import { createLesson, getModuleLessons } from '../controllers/lesson.controller.js'

import { authenticate } from "../middleware/authenticate.middleware.js"
import { authorize } from '../middleware/authorize.middleware.js'
import { upload } from "../lib/multer.js"
import { requireModuleAccess } from '../middleware/requireModuleAccess.middleware.js'
import { isVerifiedAndApproved } from '../middleware/verifiedAndApproved.js'

const router = express.Router()


// LESSON CONTROLLER
router.post("/:id/lessons",
    authenticate,
    isVerifiedAndApproved,
    authorize("instructor", "admin"),
    upload.single("file"), 
    createLesson
)
router.get("/:id/lessons",
    authenticate,
    isVerifiedAndApproved,
    requireModuleAccess,
    getModuleLessons,
)

/* ---------- PUBLIC ROUTES ---------- */
router.get("/:id", getModule)


/* ---------- AUTH REQUIRED ---------- */
router.use(authenticate, isVerifiedAndApproved, authorize("instructor", "admin"))

router.patch("/:id", updateModule)
router.delete("/:id", deleteModule)

export default router

// Remember every :id in here is for modules