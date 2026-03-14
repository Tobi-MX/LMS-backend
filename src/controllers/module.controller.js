import { createModuleService, getCourseModulesService } from "../services/module.service.js"

export const createModule = async (req, res, next) => {
    try {
        if (!req.body.title){
            res.status(400).json({success: false, message: "title is needed"})
        }
        const module = await createModuleService(
            req.params.id,
            req.body,
            req.user
        )
        res.status(201).json({
            success: true,
            data: module
        })
    } catch (error) {
        next(error)
    }
}

export const getCourseModules = async (req, res, next) => {
    try {
        const modules = await getCourseModulesService(
            req.params.id,
        )
        res.status(200).json({
            success: true,
            data: modules
        })
    } catch (error) {
        next(error)
    }
}