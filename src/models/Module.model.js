import mongoose from 'mongoose';

const moduleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    description: String,
    order: {
        type: Number,
        default: 0
    }
})

export const Module = mongoose.model("Module", moduleSchema)