import { getInstructorCourseAnalyticsService } from "../services/analytics.service.js";

export const getInstructorCourseAnalytics = async (req, res, next) => {
  try {
    const data = await getInstructorCourseAnalyticsService(
      req.params.courseId,
      req.user.id
    )

    res.json({
      success: true,
      data
    })

  } catch (error) {
    next(error)
  }
}