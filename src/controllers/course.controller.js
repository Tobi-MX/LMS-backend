import { createCourseService, updateCourseService, deleteCourseService, getCoursesService, getCourseService, getMyCoursesService, getInstructorCoursesService,  } from "../services/course.service.js"

export const createCourse = async (req, res, next) => {
    const { title } = req.body
    try {
        if (!title) {
            return res.status(400).json({ success: false, message: "Course title is required" })
        }
        const course = await createCourseService(
            req,
            req.user._id
        )
        res.status(201).json({
            success: true,
            message: "Course created Successfully",
            course
        })

    } catch (error) {
        console.log("error in createCourse", error)
        next(error)
    }
}

export const updateCourse = async (req, res, next) => {
    try {
        const course = await updateCourseService(
            req.params.id,
            req.body,
            req.file,
            req.user
        )
        res.status(200).json({
            success: true,
            message: "Course updated Successfully",
            course
        })
    } catch (error) {
        console.log("error in updateCourse", error)
        next(error)
    }
}

export const deleteCourse = async (req, res, next) => {
    try {
        await deleteCourseService(
            req.params.id,
            req.user
        )
        res.status(204).json({
            success: true,
            message: "Course deleted Successfully",
        })
    } catch (error) {
        console.log("error in deleteCourse", error)
        next(error)
    }
}

export const getCourses = async (req, res, next) => {
    try {
        const data = await getCoursesService(req.query)

        res.status(200).json({
            success: true,
            data
        })
    } catch (error) {
        console.log("error in getCourses", error)
        next(error)
    }
}

export const getCourse = async (req, res, next) => {
    try {
        const course = await getCourseService(req.params.id)

        res.status(200).json({
            success: true,
            course
        })
    } catch (error) {
        console.log("error in getCourse", error)
        next(error)
    }
}

export const getMyCourses = async (req, res, next) => {
  try {
    const courses = await getMyCoursesService(req.user._id);

    res.status(200).json({
      success: true,
      data: courses
    });

  } catch (error) {
    next(error)
  }
};

export const getInstructorCourses = async (req, res, next) => {
  try {
    const courses = await getInstructorCoursesService(req.params.id);

    res.status(200).json({
      success: true,
      data: courses
    });

  } catch (error) {
    next(error)
  }
};