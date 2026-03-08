import jwt from "jsonwebtoken"
import { User } from "../models/User.model.js"
import ENV from "../config/env.js"

export const authenticate = async (req, res, next) => {
    const token = req.cookies.token
    try {
        if (!token) return res.status(401).json({ success: false, message: "unauthorized - No token provided" })

        const decoded = jwt.verify(token, ENV.JWT_SECRET)
        if (!decoded) return res.status(401).json({ success: false, message: "unauthorzed - Invalid token" })

        const user = await User.findById(decoded.userId).select("-password")
        if (!user) return res.status(404).json({ success: false, message: "User not found" })

        req.user = user
        next()
    } catch (error) {
        console.log("Error in verifytoken ", error)
        res.status(500).json({ success: false, message: "Server Error" })
    }
} 