import { createCourseService} from "../services/course.service.js"

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
            course: {
                ...course._doc,
            }
        })

    } catch (error) {
        console.log("error in createCourse", error)
        res.status(400).json({ success: false, error: error.message })
    }
}

export const updateCourse = async (req, res) => {
    try {
        //const course = await updateCourseService()
    } catch (error) {
        
    }
}