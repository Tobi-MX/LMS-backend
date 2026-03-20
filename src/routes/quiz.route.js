import express from "express"
import { authenticate } from "../middleware/authenticate.middleware.js"
import { startQuiz, submitQuiz } from "../controllers/quiz.controller.js"
import { requireQuizAccess } from "../middleware/requireQuizAccess.middleware.js"

const router = express.Router()

router.post("/:id/start",
    authenticate,
    requireQuizAccess,
    startQuiz
)

router.post("/:id/submit",
    authenticate,
    requireQuizAccess,
    submitQuiz
)


export default router