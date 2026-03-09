import express from "express"
import multer from "multer";

import { createCourse } from "../controllers/course.controller.js"
import { authenticate } from "../middleware/authenticate.middleware.js"
import { authorize } from "../middleware/authorize.middleware.js"

const router = express.Router()

const upload = multer({ dest: "uploads/" });


/* ---------- PUBLIC ROUTES ---------- */

//router.get("/", getCourses);
//router.get("/:id", getCourse);

/* ---------- AUTH REQUIRED ---------- */

router.use(authenticate);

router.post("/create", authorize("instructor"), upload.single("thumbnail"), createCourse);

export default router