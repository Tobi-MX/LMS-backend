import express from "express"
import { getLesson, updateLesson, deleteLesson, completeLesson } from "../controllers/lesson.controller.js"
import { authenticate } from "../middleware/authenticate.middleware.js"
import { authorize } from "../middleware/authorize.middleware.js"
import { upload } from "../lib/multer.js"
import { requireEnrollment } from "../middleware/requireEnrollment.middleware.js"
import { createQuiz } from "../controllers/quiz.controller.js"
import { createDiscussion, getLessonDiscussions } from "../controllers/discussion.controller.js"

const router = express.Router()

//DISCUSSION CONTROLLER
router.post("/:id/discussions",
    authenticate,
    createDiscussion
)

router.get("/:id/discussions",
    authenticate,
    getLessonDiscussions
)


//===============================================================================
// QUIZ CONTROLLER
router.post("/:id/quiz",
    authenticate,
    authorize("instructor", "admin"),
    createQuiz
)


//===============================================================================
router.get("/:id",
    authenticate,
    requireEnrollment,
    getLesson
)

router.post("/:id/complete",
    authenticate,
    requireEnrollment,
    completeLesson
)

router.use(authenticate, authorize("instructor", "admin"))

router.patch("/:id",
    upload.single("file"),
    updateLesson
)

router.delete("/:id", deleteLesson)

export default router;

// Remember every :id in here is for lessons