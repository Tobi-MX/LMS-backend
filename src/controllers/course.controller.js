import { courseService } from "../services/course.service.js"

export const createCourse = async (req, res) => {
    try {
        const course = await courseService(
            req.body,
            req.user._id
        )
    } catch (error) {

    }
}