import { createQuizService, startQuizService, submitQuizService } from "../services/quiz.service.js";

export const createQuiz = async (req, res, next) => {
    try {
        const quiz = await createQuizService(
            req.params.id,
            req.body,
            req.user
        )

        res.status(201).json({
            success: true,
            data: quiz
        })

    } catch (error) {
        next(error)
    }
}

export const startQuiz = async (req, res, next) => {
    try {
        const quiz = await startQuizService(
            req.params.id,
            req.user._id
        )

        res.status(201).json({
            success: true,
            data: quiz
        })
    } catch (error) {
        next(error)
    }
}

export const submitQuiz = async (req, res, next) => {
    try {
        const result = await submitQuizService(
            req.params.id,
            req.body.answers,
            req.user.id
        )

        res.json({
            success: true,
            data: result
        })
    } catch (error) {
        next(error)
    }
}