import { generateStudentFeedbackService } from "../services/ai.service.js"

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