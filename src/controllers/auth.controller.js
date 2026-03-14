import { User } from "../models/User.model.js"
import bcryptjs from 'bcryptjs'
import crypto from "crypto"
import ENV from "../config/env.js"

import { generateVerificationToken } from "../utils/generateVerificationCode.js"
import { generateTokenAndSetCookie } from "../utils/generateVerificationToken.js"
import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendResetSuccessEmail } from "../emails/emailHandler.js"

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
            res.status(409).json({ success: false, error: "User already exists" })
        }

        const hashedPassword = await bcryptjs.hash(password, 10)
        const verificationToken = generateVerificationToken()
        const user = new User({
            email,
            password: hashedPassword,
            name,
            role,
            isApproved: role === "instructor" ? false : true,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
        })

        generateTokenAndSetCookie(res, user._id)

        await sendVerificationEmail(user.email, verificationToken)

        await user.save()

        res.status(201).json({
            success: true,
            message: "User created Successfully",
            user: {
                ...user._doc,
                password: undefined,
            }
        })

    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
}

export const verifyEmail = async (req, res) => {
    const { token } = req.body
    try {
        const user = await User.findOne({
            verificationToken: token,
            verificationTokenExpiresAt: { $gt: Date.now() }
        })

        if (!user) {
            return res.status(404).json({ success: false, message: "Invalid or expired verification token" })
        }

        user.isVerified = true
        user.verificationToken = undefined
        user.verificationTokenExpiresAt = undefined
        await user.save()


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

export const login = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid credentials" })
        }
        const isPasswordValid = await bcryptjs.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Invalid credentials" })
        }
        if (user.role === "instructor" && (!user.isVerified || !user.isApproved)) {
            return res.status(403).json({ message: "Verify email and wait for approval" })
        }

        generateTokenAndSetCookie(res, user._id)

        user.lastLogin = new Date()
        await user.save()

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: {
                ...user._doc,
                password: undefined,
            },
        })
    } catch (error) {
        console.log("Error in login ", error)
        res.status(500).json({ success: false, message: error.message });
    }
}

export const logout = async (_, res) => {
    res.clearCookie("token")
    res.status(200).json({ success: true, message: "Logged out successfully" })
}

export const forgotPassword = async (req, res) => {
    const { email } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ success: false, message: "User doesn't exist" })
        }
        if (!user.isVerified) {
            return res.status(401).json({ success: false, message: "User not verified" })
        }
        if (user.role === "instructor" && (!user.isVerified || !user.isApproved)) {
            return res.status(403).json({ message: "Verify email and wait for approval" })
        }

        const resetToken = crypto.randomBytes(20).toString("hex")
        const resetTokenExpiresAt = Date.now() + 1000 * 60 * 60 * 1 // 1 hour

        user.resetPasswordToken = resetToken
        user.resetPasswordExpiresAt = resetTokenExpiresAt
        await user.save()

        await sendPasswordResetEmail(email, `${ENV.CLIENT_URL}/reset-password/${resetToken}`)

        res.status(201).json({
            success: true,
            message: "Password reset request sent Successfully",
            user: {
                ...user._doc,
                password: undefined,
            }
        })

    } catch (error) {
        console.log("Error in forgotPassword ", error)
        res.status(500).json({ success: false, message: error.message });
    }
}

export const resetPassword = async (req, res) => {
    const { token } = req.params
    const { password } = req.body
    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() }
        })

        if (!user) {
            return res.status(404).json({ success: false, message: "invalid or expired reset password token" })
        }

        const hashedPassword = await bcryptjs.hash(password, 10)

        user.password = hashedPassword
        user.resetPasswordToken = undefined
        user.resetPasswordExpiresAt = undefined

        await user.save()
        await sendResetSuccessEmail(user.email)

        res.status(201).json({
            success: true,
            message: "Password changed successfully",
            user: {
                ...user._doc,
                password: undefined,
            }
        })

    } catch (error) {
        console.log("Error in resetPassword ", error)
        res.status(500).json({ success: false, message: error.message })
    }
}

export const resetVerificationToken = async (req, res) => {
    const { email } = req.body
    try {
        if (!email) {
            return res.status(400).json({ message: "All fields are required" })
        }
        const user = await User.findOne({ email })
        const verificationToken = generateVerificationToken()
        generateTokenAndSetCookie(res, user._id)

        await sendVerificationEmail(user.email, verificationToken)
        user.verificationToken = verificationToken
        user.verificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000 // 24 hours

        await user.save()

        res.status(201).json({
            success: true,
            message: "User created Successfully",
            user: {
                ...user._doc,
                password: undefined,
            }
        })
    } catch (error) {
        console.log("Error in resetPassword ", error)
        res.status(500).json({ success: false, message: error.message })
    }
}