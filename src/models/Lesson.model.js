import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    module: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Module",
        required: true
    },

    type: {
        type: String,
        enum: ["video", "text", "pdf"],
        required: true
    },

    content: String,

    file: {
        url: String,
        public_id: String
    },

    duration: Number,

    order: {
        type: Number,
        required: true
    }
    
}, { timestamps: true });

export const Lesson = mongoose.model("Lesson", lessonSchema);