import mongoose from "mongoose";
import { Enrollment } from "../models/Enrollment.model.js";
import { User } from "../models/User.model.js";
import { Course } from "../models/Course.model.js";
import { QuizAttempt } from "../models/QuizAttempt.model.js";
import { Quiz } from "../models/Quiz.model.js";
import { Lesson } from "../models/Lesson.model.js";
import { Module } from "../models/Module.model.js";
import { ForbiddenError, NotFoundError } from "../error/AppError.js";

export const getInstructorCourseAnalyticsService = async (courseId, instructorId) => {
    const course = await Course.findById(courseId)
    if (!course) {
        throw new NotFoundError("Course not found")
    }

    if (course.instructor.toString() !== instructorId) {
        throw new ForbiddenError("Not authorized")
    }

    const totalStudents = await Enrollment.countDocuments({ course: courseId })

    const avgProgressAgg = await Enrollment.aggregate([
        { $match: { course: course._id } },
        {
            $group: {
                _id: null,
                avgProgress: { $avg: "$progress" }
            }
        }
    ])

    const avgProgress = avgProgressAgg[0]?.avgProgress || 0

    return {
        totalStudents,
        avgProgress
    }
}

export const getInstructorQuizAnalyticsService = async (quizId, instructorId) => {
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

    if (course.instructor.toString() !== instructorId) {
        throw new ForbiddenError("Not authorized")
    }

    const stats = await QuizAttempt.aggregate([
        { $match: { quiz: new mongoose.Types.ObjectId(quizId) } },
        {
            $group: {
                _id: null,
                avgScore: { $avg: "$percentage" },
                totalAttempts: { $sum: 1 },
                passed: {
                    $sum: { $cond: ["$passed", 1, 0] }
                }
            }
        }
    ])

    const data = stats[0]

    const passRate = data.totalAttempts
        ? (data.passed / data.totalAttempts) * 100
        : 0

    return {
        avgScore: data.avgScore,
        totalAttempts: data.totalAttempts,
        passRate
    }
}

export const getStudentAnalyticsService = async (userId) => {
    const enrollments = await Enrollment.find({ user: userId })
        .populate("course", "title")

    const attempts = await QuizAttempt.find({ user: userId })
        .populate("quiz", "lesson")

    const bestScores = await QuizAttempt.aggregate([
        { $match: { user: userId } },
        {
            $group: {
                _id: "$quiz",
                bestScore: { $max: "$percentage" }
            }
        }
    ])

    return {
        enrollments,
        attempts,
        bestScores
    }
}

export const getAdminAnalyticsService = async () => {
    const totalUsers = await User.countDocuments()
    const totalCourses = await Course.countDocuments()
    const totalEnrollments = await Enrollment.countDocuments()

    const activeUsers = await QuizAttempt.distinct("user")

    return {
        totalUsers,
        totalCourses,
        totalEnrollments,
        activeUsers: activeUsers.length
    }
}
