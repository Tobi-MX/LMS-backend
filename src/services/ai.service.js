import { Enrollment } from "../models/Enrollment.model.js";
import { QuizAttempt } from "../models/QuizAttempt.model.js";
import { Module } from "../models/Module.model.js";
import { Lesson } from "../models/Lesson.model.js";
import { Course } from "../models/Course.model.js";
import { callGemini } from "../utils/gemini.js";
import { ForbiddenError, NotFoundError } from "../error/AppError.js";

export const generateStudentFeedbackService = async (userId, courseId) => {
    const enrollment = await Enrollment.findOne({
        user: userId,
        course: courseId
    })

    if (!enrollment) {
        throw new NotFoundError("Not enrolled")
    }

    const modules = await Module.find({ course: courseId });
    const lessons = await Lesson.find({
        module: { $in: modules.map(m => m._id) }
    });

    const attempts = await QuizAttempt.find({ user: userId })
        .populate({
            path: "quiz",
            populate: {
                path: "lesson",
                select: "title"
            }
        })

    const performance = attempts.map(a => ({
        lesson: a.quiz.lesson.title,
        score: a.percentage
    }))

    const prompt = `
You are an AI tutor.

Course structure:
${lessons.map(l => l.title).join("\n")}

Student performance:
${performance.map(p => `${p.lesson}: ${p.score}%`).join("\n")}

Student overall progress: ${enrollment.progress}%

Tasks:
1. Identify weak topics
2. Suggest what to study next (based on course order)
3. Give actionable advice

Be specific and concise.
`

    return await callGemini(prompt)
}

export const generateCourseSuggestionsService = async (courseId, instructorId) => {
    const course = await Course.findById(courseId)
    if (!course) throw new NotFoundError("Course not found")

    if (course.instructor.toString() !== instructorId) {
        throw new ForbiddenError("Not authorized")
    }

    const modules = await Module.find({ course: courseId })
    const lessons = await Lesson.find({
        module: { $in: modules.map(m => m._id) }
    })

    const prompt = `
You are an expert course reviewer.

Course title: ${course.title}

Lessons:
${lessons.map(l => l.title).join("\n")}

Give:
1. Gaps in content
2. Improvements
3. Suggestions to make course better

Be concise.
`

    return await callGemini(prompt)
}