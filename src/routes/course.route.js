import express from "express"

import { createCourse, updateCourse, deleteCourse, getCourses, getCourse, getMyCourses, getInstructorCourses } from "../controllers/course.controller.js"
import { createModule, getCourseModules } from "../controllers/module.controller.js"
import { enrollInCourse } from "../controllers/enrollment.controller.js"
import { authenticate } from "../middleware/authenticate.middleware.js"
import { authorize } from "../middleware/authorize.middleware.js"
import { upload } from "../lib/multer.js"

const router = express.Router()

// ENROLLMENT CONTROLLERS
router.post("/:id/enroll",
    authenticate,
    enrollInCourse
)


// MODULE CONTROLLERS
router.post("/:id/modules", 
    authenticate, 
    authorize("instructor", "admin"), 
    createModule
)
router.get("/:id/modules", getCourseModules)


// =================================================================
router.get("/me", authenticate, authorize("instructor"), getMyCourses)
//gets logged in instructors courses (Like for instructor dashboard)

/* ---------- PUBLIC ROUTES ---------- */

router.get("/", getCourses) // will add pagination to this route.
router.get("/:id", getCourse)
router.get("/instructors/:id", getInstructorCourses) // gets an instructor courses based on id provided

/* ---------- AUTH REQUIRED ---------- */

router.use(authenticate, authorize("instructor", "admin"));

router.post("/",
    upload.single("thumbnail"),
    createCourse
)
router.patch("/:id",
    upload.single("thumbnail"),
    updateCourse
)
router.delete("/:id", deleteCourse)

export default router

// Remember every :id in here is for courses