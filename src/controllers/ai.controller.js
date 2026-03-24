import { generateCourseSuggestionsService, generateQuizService, generateStudentFeedbackService } from "../services/ai.service.js"

export const getStudentFeedback = async (req, res, next) => {
    try {
        const feedback = await generateStudentFeedbackService(
            req.user.id,
            req.params.courseId
        )

        res.json({
            success: true,
            data: feedback
        })

    } catch (error) {
        next(error)
    }
}

export const generateCourseSuggestions = async (req, res, next) => {
    try {
        const suggestion = await generateCourseSuggestionsService(
            req.params.courseId,
            req.user.id
        )

        res.json({
            success: true,
            data: suggestion
        })

    } catch (error) {
        next(error)
    }
}

export const generateQuiz = async (req, res, next) => {
    try {
        const quiz = await generateQuizService(
            req.params.lessonId,
            req.user.id
        )

        res.json({
            success: true,
            data: quiz
        })

    } catch (error) {
        next(error)
    }
}