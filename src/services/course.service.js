import { Course } from "../models/Course.model.js"
import { uploadThumbnail } from "../utils/uploadThumbnail.js";

export const createCourseService = async (req, userId) => {
    let thumbnailUrl;

    if (req.file) {
        thumbnailUrl = await uploadThumbnail(req.file)
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
    const course = await Course.findById(courseId);

    if (!course) {
        return res.status(400).json({ message: "Course not found" })
    }
    if (course.instructor.toString() !== user._id.toString()) {
        return res.status(400).json({ message: "Not authorized" })
    }

    if (file) {
        const imageUrl = await uploadThumbnail(file);
        course.thumbnail = imageUrl;
    }

    const allowedFields = [
        "title",
        "description",
        "thumbnail",
        "status"
    ];

    allowedFields.forEach(field => {
        if (data[field] !== undefined) {
            course[field] = data[field];
        }
    });

    return course
}