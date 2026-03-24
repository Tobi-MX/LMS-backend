import { Enrollment } from "../models/Enrollment.model.js";
import { QuizAttempt } from "../models/QuizAttempt.model.js";
import { Module } from "../models/Module.model.js";
import { Lesson } from "../models/Lesson.model.js";
import { callGemini } from "../utils/gemini.js";

export const generateStudentFeedbackService = async (userId, courseId) => {

    const enrollment = await Enrollment.findOne({
        user: userId,
        course: courseId
    })

    if (!enrollment) {
        throw new Error("Not enrolled")
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