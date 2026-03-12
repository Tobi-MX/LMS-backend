import express from "express"

import { createCourse, updateCourse, deleteCourse, getCourses, getCourse } from "../controllers/course.controller.js"
import { authenticate } from "../middleware/authenticate.middleware.js"
import { authorize } from "../middleware/authorize.middleware.js"
import { upload } from "../lib/multer.js"

const router = express.Router()


/* ---------- PUBLIC ROUTES ---------- */

router.get("/", getCourses) // will add pagination to this route.
router.get("/:id", getCourse)

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
router.delete("/:id",
    deleteCourse
)

export default router