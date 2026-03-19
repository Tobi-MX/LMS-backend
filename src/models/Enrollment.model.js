import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },

    status: {
        type: String,
        enum: ["active", "completed"],
        default: "active"
    },

    progress: {
        type: Number,
        default: 0 // percentage
    },

    completedLessons: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lesson"
    }]
}, { timestamps: true });

enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

export const Enrollment = mongoose.model("Enrollment", enrollmentSchema);