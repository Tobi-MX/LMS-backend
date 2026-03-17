import { Enrollment } from "../models/Enrollment.model.js"
import { Course } from "../models/Course.model.js"
import { BadRequestError, ConflictError, NotFoundError } from "../error/AppError.js"

export const enrollInCourseService = async (courseId, user) => {
    const course = await Course.findById(courseId)
    if (!course) {
        throw new NotFoundError("Course not found")
    }
    if (course.instructor.toString() === user._id) {
        throw new BadRequestError("Instructor cannot enroll in own course")
    }
    const existing = await Enrollment.findOne({
        user: user._id,
        course: courseId
    })
    if (existing) {
        throw new ConflictError("Already enrolled")
    }
    const enrollment = new Enrollment({
        user: user._id,
        course: courseId
    })

    enrollment.save() 
    return enrollment
}

export const getEnrolledCoursesService = async (userId) => {
    const enrollments = await Enrollment
        .find({ user: userId })
        .populate("course")

    return enrollments
}