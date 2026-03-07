import { User } from "../models/User.model.js"
import bcryptjs from 'bcryptjs'

import { generateVerificationToken } from "../utils/generateVerificationCode.js"
import { generateTokenAndSetCookie } from "../utils/generateVerificationToken.js"
import { sendVerificationEmail, sendWelcomeEmail } from "../emails/emailHandler.js"

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
            isApproved: role === "student" ? true : false,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
        })
        await user.save()

        generateTokenAndSetCookie(res, user._id)

        await sendVerificationEmail(user.email, verificationToken)

        res.status(201).json({
            success: true,
            message: "User created Successfully",
            user: {
                ...user._doc,
                password: undefined,
            }
        })

    } catch (error) {
        res.status(400).json({ success: false, error: error.message })
    }
}

export const verifyEmail = async (req, res) => {
    const { token } = req.body
    try {
        const user = await User.findOne({
            verificationToken: token,
            verificationTokenExpiresAt: {$gt: Date.now()}
        })

        if (!user) {
            return res.status(400).json({success: false, message: "Invalid or expired verification token"})
        }

        user.isVerified = true
        user.verificationToken = undefined
        user.verificationTokenExpiresAt = undefined

        await sendWelcomeEmail(user.email, user.name)
        res.status(201).json({
            success: true,
            message: "Email successfully verified",
            user: {
                ...user._doc,
                password: undefined
            },
        })

    } catch (error) {
        console.log("error in verify-email", error)
        res.status(500).json({ success: false, message: "Server error" })
    }
}