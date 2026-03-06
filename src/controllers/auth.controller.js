import { User } from "../models/User.model.js"
import bcryptjs from 'bcryptjs'

import { generateVerificationToken } from "../utils/generateVerificationCode.js"
import { generateTokenAndSetCookie } from "../utils/generateVerificationToken.js"

export const signup = async (req, res) => {
    const { name, email, password, role } = req.body
    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password should be at least 6 characters" })
        }

        // check if emailis valid: regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const userAlreadyExists = await User.findOne({ email })
        if (userAlreadyExists) {
            res.status(400).json({ success: false, error: "User already exists" })
        }

        const hashedPassword = await bcryptjs.hash(password, 10)
        const verificationToken = generateVerificationToken()
        const user = new User({
            email,
            password: hashedPassword,
            name,
            role,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 48 * 60 * 60 * 1000 // 48 hours
        })
        await user.save()

        generateTokenAndSetCookie(res, user._id)


    } catch (error) {

    }
}