import { Course } from "../models/Course.model.js"
import cloudinary from "../lib/cloudinary.js"

export const createCourseService = async (req, userId) => {
    let thumbnailUrl;

    if (req.file?.path) {
        const uploadResponse = await cloudinary.uploader.upload(req.file.path);
        thumbnailUrl = uploadResponse.secure_url;
    } else if (req.body.thumbnail) {
        const uploadResponse = await cloudinary.uploader.upload(req.body.thumbnail);
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