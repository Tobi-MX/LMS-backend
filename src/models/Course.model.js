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
        url: String,
        public_id: String
    },
    status: {
        type: String,
        enum: ["draft", "published"],
        default: "draft"
    }
}, { timestamps: true })

export const Course = mongoose.model("Course", courseSchema)