import { enrollInCourseService, getEnrolledCoursesService, getCourseStudentsService } from "../services/enrollment.service.js";

export const enrollInCourse = async (req, res, next) => {
    try {
        const enrollment = await enrollInCourseService(
            req.params.id,
            req.user
        )

        res.status(201).json({
            success: true,
            data: enrollment
        })
    } catch (error) {
        next(error)
    }
}

export const getEnrolledCourses = async (req, res, next) => {
    try {
        const courses = await getEnrolledCoursesService(req.user.id)

        res.json({
            success: true,
            data: courses
        })
    } catch (error) {
        next(error)
    }
}

export const getCourseStudents = async (req, res, next) => {
    try {
        const students = await getCourseStudentsService(
            req.params.id,
            req.user
        )

        res.json({
            success: true,
            data: students
        })
    } catch (error) {
        next(error)
    }
}

