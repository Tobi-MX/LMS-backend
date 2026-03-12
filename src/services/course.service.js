import { Course } from "../models/Course.model.js"
import { uploadImage, deleteImage } from "../utils/cloudinary.js";

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
    const course = await Course.findById(courseId);

    if (!course) {
        return res.status(404).json({ message: "Course not found" })
    }
    if (
        course.instructor.toString() !== user._id.toString() &&
        user.role !== "admin"
    ) {
        return res.status(403).json({ message: "Not authorized" })
    }

    if (file) {
        if (course.thumbnail?.public_id) {
            await deleteImage(course.thumbnail.public_id)
        }

        const thumbnailUrl = await uploadImage(file);
        course.thumbnail = {
            url: thumbnailUrl.secure_url,
            public_id: thumbnailUrl.public_id
        };
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
    const course = await Course.findById(courseId)

    if (!course) {
        return res.status(404).json({ message: "Course not found" })
    }
    if (
        course.instructor.toString() !== user._id.toString() &&
        user.role !== "admin"
    ) {
        return res.status(403).json({ message: "Not authorized" })
    }
    if (course.thumbnail?.public_id) {
        await deleteImage(course.thumbnail.public_id)
    }

    //await Module.deleteMany({ course: courseId });
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
    const course = await Course.findById(courseId)
        .populate("instructor", "name email")

    if (!course) {
        return res.status(404).json({ message: "Course not found" })
    }

    return course
}