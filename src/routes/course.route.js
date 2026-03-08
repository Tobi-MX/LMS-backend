import express from "express"
import { createCourse } from "../controllers/course.controller.js"
import { authenticate } from "../middleware/authenticate.middleware.js"
import { authorize } from "../middleware/authorize.middleware.js"

const router = express.Router()

/* ---------- PUBLIC ROUTES ---------- */

router.get("/", getCourses);
router.get("/:id", getCourse);

/* ---------- AUTH REQUIRED ---------- */

router.use(authenticate);

router.post("/", authorize("instructor"), createCourse);

export default router