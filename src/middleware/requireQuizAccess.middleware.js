import { Quiz } from "../models/Quiz.model.js"
import { Lesson } from "../models/Lesson.model.js";
import { Module } from "../models/Module.model.js";
import { Course } from "../models/Course.model.js";
import { Enrollment } from "../models/Enrollment.model.js";
import { NotFoundError } from "../error/AppError.js";

export const requireQuizAccess = async (req, res, next) => {
    const quizId = req.params.id
    try {
        const quiz = await Quiz.findById(quizId)
        if (!quiz) {
            throw new NotFoundError("Quiz not found")
        }

        const lesson = await Lesson.findById(quiz.lesson)
        if (!lesson) {
            throw new NotFoundError("Lesson not found")
        }

        const module = await Module.findById(lesson.module)
        if (!module) {
            throw new NotFoundError("Module not found")
        }

        const course = await Course.findById(module.course)
        if (!course) {
            throw new NotFoundError("Course not found")
        }

        if (
            course.instructor.toString() === req.user._id &&
            req.user.role !== "admin"
        ) {
            return next()
        }

        const enrollment = await Enrollment.findOne({
            user: req.user.id,
            course: course._id
        })

        if (!enrollment) {
            return res.status(403).json({
                success: false,
                message: "You are not enrolled in this course"
            })
        }
        next()
    } catch (error) {
        next(error)
    }
};