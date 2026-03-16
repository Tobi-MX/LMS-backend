import express from "express"
import { getLesson, updateLesson, deleteLesson } from "../controllers/lesson.controller.js"
import { authenticate } from "../middleware/authenticate.middleware.js"
import { authorize } from "../middleware/authorize.middleware.js"
import { upload } from "../lib/multer.js"
const router = express.Router()

/* ---------- PUBLIC ROUTES ---------- */
router.get("/:id", getLesson)

/* ---------- AUTH REQUIRED ---------- */
router.use(authenticate, authorize("instructor", "admin"))

router.patch("/:id", 
    upload.single("file"), 
    updateLesson
)
router.delete("/:id", deleteLesson)

export default router;

// Remember every :id in here is for lessons