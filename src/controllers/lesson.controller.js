import { createLessonService } from "../services/lesson.service.js"

export const createLesson = async (req, res, next) => {
    try {
        if (!req.body.title) {
            res.status(400).json({ success: false, message: "Title is required" })
        }
        const lesson = await createLessonService(
            req.params.id,
            req.body,
            req.file,
            req.user
        )

        res.status(201).json({
            success: true,
            data: lesson
        })
    } catch (error) {
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