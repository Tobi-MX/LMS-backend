import { createCourseService, updateCourseService, deleteCourseService, getCoursesService } from "../services/course.service.js"

export const createCourse = async (req, res) => {
    const { title } = req.body
    try {
        if (!title) {
            return res.status(400).json({ success: false, message: "Course title is required" })
        }
        const course = await createCourseService(
            req,
            req.user._id
        )
        res.status(201).json({
            success: true,
            message: "Course created Successfully",
            course
        })

    } catch (error) {
        console.log("error in createCourse", error)
        res.status(500).json({ success: false, error: error.message })
    }
}

export const updateCourse = async (req, res) => {
    try {
        const course = await updateCourseService(
            req.params.id,
            req.body,
            req.file,
            req.user
        )
        res.status(200).json({
            success: true,
            message: "Course updated Successfully",
            course
        })
    } catch (error) {
        console.log("error in updateCourse", error)
        res.status(500).json({ success: false, error: error.message })
    }
}

export const deleteCourse = async (req, res) => {
    try {
        await deleteCourseService(
            req.params.id,
            req.user
        )
        res.status(204).json({
            success: true,
            message: "Course deleted Successfully",
        })
    } catch (error) {
        console.log("error in deleteCourse", error)
        res.status(500).json({ success: false, error: error.message })
    }
}

export const getCourses = async (req, res) => {
    try {
        const data = await getCoursesService(req.query)

        res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        console.log("error in getCourses", error)
        res.status(500).json({ success: false, error: error.message })
    }
}