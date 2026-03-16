

export const createLesson = async (req, res, next) => {
    const { title } = req.body
    try {
        if (!title) {
            return res.status(400).json({ success: false, message: "Course title is required" })
        }
        const lesson = await createLessonService(
            req,
            req.user._id
        )
        res.status(201).json({
            success: true,
            message: "Lesson created Successfully",
            course
        })

    } catch (error) {
        console.log("error in createCourse", error)
        next(error)
    }
}

export const getModuleLessons = async () => {

}

export const getLesson = async () => {

}

export const updateLesson = async () => {

}

export const deleteLesson = async () => {

}