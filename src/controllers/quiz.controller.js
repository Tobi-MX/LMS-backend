import { createQuizService } from "../services/quiz.service.js";

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