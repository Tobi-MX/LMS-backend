import mongoose from "mongoose"

const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },

    options: [{
        type: String,
        required: true
    }],

    correctAnswer: {
        type: Number, // index of correct option
        required: true
    }
});

const quizSchema = new mongoose.Schema({
    lesson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lesson",
        required: true
    },

    questions: [questionSchema],

    passingScore: {
        type: Number,
        default: 50
    },

    timeLimit: Number, // seconds (optional)

    maxAttempts: {
        type: Number,
        default: 1
    },

    shuffleQuestions: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

quizSchema.index({ lesson: 1 }, { unique: true });

export const Quiz = mongoose.model("Quiz", quizSchema);