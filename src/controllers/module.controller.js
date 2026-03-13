import { createModuleService } from "../services/module.service.js"

export const createModule = async (req, res, next) => {
    try {
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