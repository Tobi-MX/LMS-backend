import { Enrollment } from "../models/Enrollment.model.js";
import { Course } from "../models/Course.model.js";
import { ForbiddenError, NotFoundError } from "../error/AppError.js";

export const getInstructorCourseAnalyticsService = async (courseId, instructorId) => {
    const course = await Course.findById(courseId)
    if (!course) {
        throw new NotFoundError("Course not found")
    }

    if (course.instructor.toString() !== instructorId) {
        throw new ForbiddenError("Not authorized")
    }

    const totalStudents = await Enrollment.countDocuments({ course: courseId })

    const avgProgressAgg = await Enrollment.aggregate([
        { $match: { course: course._id } },
        {
            $group: {
                _id: null,
                avgProgress: { $avg: "$progress" }
            }
        }
    ])

    const avgProgress = avgProgressAgg[0]?.avgProgress || 0

    return {
        totalStudents,
        avgProgress
    }
}
