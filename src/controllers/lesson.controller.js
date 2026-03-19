import { createLessonService, getModuleLessonsService, getLessonService, updateLessonService, deleteLessonService, completeLessonService } from "../services/lesson.service.js"

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

export const getModuleLessons = async (req, res, next) => {
    try {
        const data = await getModuleLessonsService(
            req.params.id
        )
        res.status(200).json({
            success: true,
            data
        })
    } catch (error) {
        next(error)
    }
}

export const getLesson = async (req, res, next) => {
    try {
        const lesson = await getLessonService(
            req.params.id
        )
        res.status(200).json({
            success: true,
            data: lesson
        })
    } catch (error) {
        next(error)
    }
}

export const updateLesson = async (req, res, next) => {
    try {
        const lesson = await updateLessonService(
            req.params.id,
            req.body,
            req.file,
            req.user
        )
        res.status(200).json({
            success: true,
            data: lesson
        })
    } catch (error) {
        next(error)
    }
}

export const deleteLesson = async (req, res, next) => {
    try {
        await deleteLessonService(
            req.params.id,
            req.user
        )
        res.status(200).json({
            success: true,
            message: "Lesson deleted successfully"
        })
    } catch (error) {
        next(error)
    }
}

export const completeLesson = async(req, res, next) => {
    try {
        const lesson = await completeLessonService(
            req.params.id,
            req.user._id
        )

        res.status(200).json({
            success: true,
            data: lesson
        })
    } catch (error) {
        next(error)
    }
}