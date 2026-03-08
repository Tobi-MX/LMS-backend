import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    thumbnail: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        enum: ["draft", "published"],
        default: "draft"
    }
})

export const Course = mongoose.model("Course", courseSchema)