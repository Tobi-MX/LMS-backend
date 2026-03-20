import { QuizAttempt } from "../models/QuizAttempt.model.js";
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

    const existingQuiz = await Quiz.findOne({ lesson: lessonId });

    if (existingQuiz) {
        throw ForbiddenError("Quiz already exists for this lesson");
    }

    const quiz = new Quiz({
        lesson: lessonId,
        questions: data.questions,
        passingScore: data.passingScore || 50,
        timeLimit: data.timeLimit,
        maxAttempts: data.maxAttempts,
        shuffleQuestions: data.shuffleQuestions
    })

    await quiz.save()
    return quiz
}

export const getQuizService = async (lessonId) => {
    const lesson = await Lesson.findById(lessonId)
    if (!lesson) {
        throw new NotFoundError("Lesson not found")
    }

    const quiz = await Quiz.findOne({ lesson: lessonId }).lean()
    if (!quiz) {
        throw new NotFoundError("Quiz not found")
    }

    let questions = [...quiz.questions]

    if (quiz.shuffleQuestions) {
        questions = shuffleArray(questions)
    }

    const sanitizedQuestions = questions.map(q => ({
        question: q.question,
        options: q.options
    }))

    return {
        ...quiz,
        questions: sanitizedQuestions
    }
}

export const startQuizService = async (quizId, userId) => {
    const quiz = await Quiz.findById(quizId)
    if (!quiz) {
        throw new NotFoundError("Quiz not found")
    }

    // check attempts
    const attemptsCount = await QuizAttempt.countDocuments({
        user: userId,
        quiz: quizId
    })

    if (quiz.maxAttempts && attemptsCount >= quiz.maxAttempts) {
        throw new ForbiddenError("Maximum attempts reached")
    }

    const attempt = new QuizAttempt({
        user: userId,
        quiz: quizId,
        startedAt: new Date()
    })

    await attempt.save()
    return attempt
}

export const submitQuizService = async (attemptId, answers) => {
    const attempt = await QuizAttempt.findById(attemptId).populate("quiz")
    if (!attempt) {
        throw new NotFoundError("Attempt not found")
    }

    const quiz = attempt.quiz

    let score = 0

    quiz.questions.forEach((q, index) => {
        const userAnswer = answers.find(a => a.questionIndex === index)

        if (userAnswer && userAnswer.selectedOption === q.correctAnswer) {
            score++
        }
    })

    const percentage = (score / quiz.questions.length) * 100

    // time calculation
    const submittedAt = new Date()
    const duration = (submittedAt - attempt.startedAt) / 1000

    // enforce time limit
    if (quiz.timeLimit && duration > quiz.timeLimit) {
        throw new Error("Time limit exceeded")
    }

    attempt.answers = answers
    attempt.score = score
    attempt.percentage = percentage
    attempt.passed = percentage >= quiz.passingScore
    attempt.submittedAt = submittedAt
    attempt.duration = duration

    await attempt.save()

    return attempt
}