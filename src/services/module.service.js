import mongoose from "mongoose";
import { Module } from "../models/Module.model.js";
import { Course } from "../models/Course.model.js";
import { NotFoundError, ForbiddenError, BadRequestError } from "../error/AppError.js";

export const createModuleService = async (courseId, data, user) => {
    const course = await Course.findById(courseId)

    if (!course) {
        throw new NotFoundError("Course not found")
    }
    if (user.role !== "admin" &&
        !course.instructor.toString() === user._id.toString()
    ) {
        throw new ForbiddenError("Not authorized")
    }

    const lastModule = await Module
        .findOne({ course: courseId })
        .sort({ order: -1 })

    const nextOrder = lastModule ? lastModule.order + 1 : 1;

    const newModule = new Module({
        title: data.title,
        description: data.description,
        course: courseId,
        order: nextOrder
    })
    await newModule.save()
    return newModule
}

export const getCourseModulesService = async (courseId) => {
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
        throw new BadRequestError("Invalid course id");
    }
    const course = await Course.findById(courseId)

    if (!course) {
        throw new NotFoundError("Course not found")
    }

    const modules = await Module.find({
        course: courseId
    }).sort({ order: 1 })

    return modules
}

export const getModuleService = async (moduleId) => {
    if (!mongoose.Types.ObjectId.isValid(moduleId)) {
        throw new BadRequestError("Invalid course id");
    }
    const foundModule = await Module.findById(moduleId)

    if (!foundModule) {
        throw new NotFoundError("Module not found")
    }
    return foundModule
}