import mongoose from 'mongoose';

const moduleSchema = new mongoose.Schema({
  title: String,
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  },
  order: Number
})

export const Course = mongoose.model("Course", courseSchema)