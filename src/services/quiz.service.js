import { Quiz } from "../models/Quiz.model.js";
import { Lesson } from "../models/Lesson.model.js";
import { Module } from "../models/Module.model.js";
import { Course } from "../models/Course.model.js";
import { BadRequestError, ForbiddenError, NotFoundError } from "../error/AppError.js";

export const createQuizService = async (lessonId, data, user) => {
    const lesson = await Lesson.findById(lessonId)
    if (!lesson) {
        throw new NotFoundError("Lesson not found")
    }

    if (lesson.type !== "quiz") {
        throw new BadRequestError("Lesson is not a quiz type")
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
        course.instructor.toString() !== user._id.toString() &&
        user.role !== "admin"
    ) {
        throw new ForbiddenError("Not authorized")
    }

    const quiz = new Quiz({
        lesson: lessonId,
        questions: data.questions,
        passingScore: data.passingScore || 50
    })

    quiz.save()
    return quiz
};