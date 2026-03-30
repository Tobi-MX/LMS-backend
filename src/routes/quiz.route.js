import express from "express"
import { authenticate } from "../middleware/authenticate.middleware.js"
import { getQuiz, getQuizzes, startQuiz, submitQuiz } from "../controllers/quiz.controller.js"
import { requireQuizAccess } from "../middleware/requireQuizAccess.middleware.js"
import { requireAttemptAccess } from "../middleware/requireAttemptAccess.middleware.js"
import { isVerifiedAndApproved } from "../middleware/verifiedAndApproved.js"
import { authorize } from "../middleware/authorize.middleware.js"

const router = express.Router()

router.get("/:id/quiz",
    authenticate,
    isVerifiedAndApproved,
    requireQuizAccess,
    getQuiz
)

router.get("/:courseId",
    authenticate,
    isVerifiedAndApproved,
    authorize("instructor", "admin"),
    getQuizzes
)

router.post("/:id/start",
    authenticate,
    isVerifiedAndApproved,
    requireQuizAccess,
    startQuiz
)

router.post("/attempts/:attemptId/submit",
    authenticate,
    isVerifiedAndApproved,
    requireAttemptAccess,
    submitQuiz
)


export default router