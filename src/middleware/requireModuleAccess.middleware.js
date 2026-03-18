import { Module } from "../models/Module.model.js";
import { Course } from "../models/Course.model.js";
import { Enrollment } from "../models/Enrollment.model.js";
import { NotFoundError } from "../error/AppError.js";

export const requireModuleAccess = async (req, res, next) => {
  try {
    const moduleId = req.params.id

    const module = await Module.findById(moduleId)
    if (!module) {
        throw new NotFoundError("Module not found")
    }

    const course = await Course.findById(module.course)
    if (!course) {
        throw new NotFoundError("Course not found")
    }

    if (
        course.instructor.toString() === req.user._id &&
        req.user.role !== "admin"
    ) {
      return next()
    }

    const enrollment = await Enrollment.findOne({
      user: req.user.id,
      course: course._id
    })

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: "Not enrolled"
      })
    }

    next()

  } catch (error) {
    next(error)
  }
};