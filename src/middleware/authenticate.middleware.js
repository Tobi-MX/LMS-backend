import jwt from "jsonwebtoken"
import { User } from "../models/User.model.js"
import ENV from "../config/env.js"
import { NotFoundError, UnauthorizedError } from "../error/AppError.js"

export const authenticate = async (req, res, next) => {
    const token = req.cookies.token
    try {
        if (!token) {
            return next(new UnauthorizedError("Unauthorized - No token provided"))
        }

        const decoded = jwt.verify(token, ENV.JWT_SECRET)
        if (!decoded) {
            return next(new UnauthorizedError("Unauthorzed - Invalid token"))
        }

        const user = await User.findById(decoded.userId).select("-password")
        if (!user) {
            return next(new NotFoundError("User not found"))
        }

        req.user = user
        next()
    } catch (error) {
        next(error)
    }
} 