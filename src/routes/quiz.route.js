import express from "express"
import { authenticate } from "../middleware/authenticate.middleware.js"
import { getQuiz, startQuiz, submitQuiz } from "../controllers/quiz.controller.js"
import { requireQuizAccess } from "../middleware/requireQuizAccess.middleware.js"
import { requireAttemptAccess } from "../middleware/requireAttemptAccess.middleware.js"

const router = express.Router()

router.get("/:id/quiz",
    authenticate,
    requireQuizAccess,
    getQuiz
)

router.post("/:id/start",
    authenticate,
    requireQuizAccess,
    startQuiz
)

router.post("/attempts/:attemptId/submit",
    authenticate,
    requireAttemptAccess,
    submitQuiz
)


export default router