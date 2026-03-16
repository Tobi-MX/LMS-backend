import { Lesson } from "../models/Lesson.model.js"
import { Module } from "../models/Module.model.js"
import { Course } from "../models/Course.model.js"
import { BadRequestError, ForbiddenError, NotFoundError } from "../error/AppError.js"
import { uploadLesson } from "../utils/cloudinary.js"

export const createLessonService = async (moduleId, data, file, user) => {
    const module = await Module.findById(moduleId);
    if (!module) {
        throw new NotFoundError("Module not found");
    }
    const course = await Course.findById(module.course);
    if (!course) {
        throw new NotFoundError("Course not found")
    };
    if (course.instructor.toString() !== user.id) {
        throw new ForbiddenError("Not authorized");
    }
    // calculate order
    const lastLesson = await Lesson
        .findOne({ module: moduleId })
        .sort({ order: -1 })
    const nextOrder = lastLesson ? lastLesson.order + 1 : 1

    let fileUrl;
    let filePublicId;
    let content;
    let duration;
    // TEXT LESSON
    if (data.type === "text") {
        content = data.content
    }
    // VIDEO OR PDF LESSON
    if (data.type === "video" || data.type === "pdf") {
        if (!file) {
            throw new BadRequestError("File is required")
        }
        const uploadResponse = await uploadLesson(file)
        fileUrl = uploadResponse.secure_url
        filePublicId = uploadResponse.public_id
        if (data.type === "video") {
            duration = Math.round(uploadResponse.duration)
        }
    }
    const lesson = new Lesson({
        title: data.title,
        module: moduleId,
        type: data.type,
        content,
        file: {
            url: fileUrl,
            public_id: filePublicId
        },
        duration,
        order: nextOrder
    })
    await lesson.save()
    return lesson
};