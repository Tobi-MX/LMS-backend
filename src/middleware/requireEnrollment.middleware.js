import { Lesson } from "../models/Lesson.model.js";
import { Module } from "../models/Module.model.js";
import { Course } from "../models/Course.model.js";
import { Enrollment } from "../models/Enrollment.model.js";
import { NotFoundError } from "../error/AppError.js";

export const requireEnrollment = async (req, res, next) => {
    const lessonId = req.params.id
    try {
        const lesson = await Lesson.findById(lessonId)
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
            course.instructor.toString() === req.user._id.toString() &&
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