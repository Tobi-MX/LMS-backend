import { Course } from "../models/Course.model.js"
import { Module } from "../models/Module.model.js";
import { uploadImage, deleteImage } from "../utils/cloudinary.js";
import { NotFoundError, ForbiddenError, BadRequestError } from "../error/AppError.js";

import mongoose from "mongoose";

export const createCourseService = async (req, userId) => {
    let thumbnailUrl;

    if (req.file) {
        thumbnailUrl = await uploadImage(req.file)
    }

    const course = new Course({
        ...req.body,
        instructor: userId,
        thumbnail: {
            url: thumbnailUrl.secure_url,
            public_id: thumbnailUrl.public_id
        },
        status: "draft"
    })

    await course.save()
    return course
}

export const updateCourseService = async (courseId, data, file, user) => {
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
        throw new BadRequestError("Invalid course id");
    }
    const course = await Course.findById(courseId);

    if (!course) {
        throw new NotFoundError("Course not found")
    }
    if (
        course.instructor.toString() !== user._id.toString() &&
        user.role !== "admin"
    ) {
        throw new ForbiddenError("Not authorized")
    }

    if (file) {
        if (course.thumbnail?.public_id) {
            await deleteImage(course.thumbnail.public_id)
        }

        const thumbnailUrl = await uploadImage(file);
        course.thumbnail = {
            url: thumbnailUrl.secure_url,
            public_id: thumbnailUrl.public_id
        }
    }

    const allowedFields = [
        "title",
        "description",
        "thumbnail",
        "status"
    ]

    allowedFields.forEach(field => {
        if (data[field] !== undefined) {
            course[field] = data[field];
        }
    })

    await course.save()
    return course
}

export const deleteCourseService = async (courseId, user) => {
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
        throw new BadRequestError("Invalid course id");
    }
    const course = await Course.findById(courseId)

    if (!course) {
        throw new NotFoundError("Course not found")
    }
    if (
        course.instructor.toString() !== user._id.toString() &&
        user.role !== "admin"
    ) {
        throw new ForbiddenError("Course not found")
    }
    if (course.thumbnail?.public_id) {
        await deleteImage(course.thumbnail.public_id)
    }

    await Module.deleteMany({ course: courseId });
    //await Lesson.deleteMany({ course: courseId });
    //await Enrollment.deleteMany({ course: courseId }); will add all that needs to later

    await course.deleteOne();
}

export const getCoursesService = async (query) => {
    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 10

    const skip = (page - 1) * limit

    const courses = await Course.find()
        .populate("instructor", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await Course.countDocuments()

    return {
        courses,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        totalCourses: total
    }
}

export const getCourseService = async (courseId) => {
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
        throw new BadRequestError("Invalid course id");
    }
    const course = await Course.findById(courseId)
        .populate("instructor", "name email")

    if (!course) {
        throw new NotFoundError("Course not found")
    }

    return course
}

export const getMyCoursesService = async (instructorId) => {
    if (!mongoose.Types.ObjectId.isValid(instructorId)) {
        throw new BadRequestError("Invalid course id");
    }
    const courses = await Course.find({
        instructor: instructorId
    }).sort({ createdAt: -1 })

    return courses;
};

export const getInstructorCoursesService = async (instructorId) => {
    if (!mongoose.Types.ObjectId.isValid(instructorId)) {
        throw new BadRequestError("Invalid course id");
    }
    const courses = await Course.find({
        instructor: instructorId
    })
        .populate("instructor", "name")
        .sort({ createdAt: -1 });

    return courses;
};