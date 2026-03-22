import mongoose from "mongoose";

const discussionSchema = new mongoose.Schema({

    lesson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lesson",
        required: true
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    content: {
        type: String,
        required: true
    }

}, { timestamps: true })

export const Discussion = mongoose.model("Discussion", discussionSchema);