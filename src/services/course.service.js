import { Course } from "../models/Course.model.js"
import cloudinary from "../lib/cloudinary.js"

export const createCourseService = async (req, userId) => {
    let thumbnailUrl;

    if (req.file) {
        const uploadResponse = await cloudinary.uploader.upload(req.file.path);
        thumbnailUrl = uploadResponse.secure_url;
    }

    const course = new Course({
        ...req.body,
        instructor: userId,
        thumbnail: thumbnailUrl,
        status: "draft"
    })

    await course.save()
    return course
}

export const updateCourseService = async (courseId, data, file, user) => {
    
}