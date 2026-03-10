import express from "express"

import { createCourse, updateCourse } from "../controllers/course.controller.js"
import { authenticate } from "../middleware/authenticate.middleware.js"
import { authorize } from "../middleware/authorize.middleware.js"
import { upload } from "../lib/multer.js"

const router = express.Router()


/* ---------- PUBLIC ROUTES ---------- */

//router.get("/", getCourses)
//router.get("/:id", getCourse)

/* ---------- AUTH REQUIRED ---------- */

router.use(authenticate);

router.post("/", 
    authorize("instructor", "admin"), 
    upload.single("thumbnail"), 
    createCourse
)
router.patch("/:id", 
    authorize("instructor", "admin"), 
    upload.single("thumbnail"), 
    updateCourse
)

export default router