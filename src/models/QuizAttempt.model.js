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
        questionIndex: Number,
        selectedOption: Number
    }],

    score: Number,
    percentage: Number,

    passed: Boolean,

    startedAt: Date,
    submittedAt: Date,

    duration: Number // seconds taken

}, { timestamps: true });

export const QuizAttempt = mongoose.model("QuizAttempt", QuizAttempt)