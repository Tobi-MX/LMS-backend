import mongoose from "mongoose";

const quizAttemptSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
        required: true
    },

    answers: [{
        questionId: mongoose.Schema.Types.ObjectId,
        selectedOption: Number,
        _id: false
    }],

    score: Number,
    percentage: Number,

    passed: Boolean,

    startedAt: Date,
    submittedAt: Date,

    duration: Number // seconds taken

}, { timestamps: true });

export const QuizAttempt = mongoose.model("QuizAttempt", quizAttemptSchema)