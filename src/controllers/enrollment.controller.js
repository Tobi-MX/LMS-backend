import { enrollInCourseService } from "../services/enrollment.service.js";

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
};