import { User } from "../models/User.model.js"
import bcryptjs from 'bcryptjs'
import crypto from "crypto"
import ENV from "../config/env.js"

import { forgotPasswordService, loginService, resetPasswordService, resetVerificationTokenService, signupService, verifyEmailService } from "../services/auth.service.js"
import { generateTokenAndSetCookie } from "../utils/generateVerificationToken.js"
import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendResetSuccessEmail } from "../emails/emailHandler.js"

export const signup = async (req, res, next) => {
    const { name, email, password, role } = req.body
    try {
        const user = await signupService(
            name,
            email,
            password,
            role,
            res
        )
        generateTokenAndSetCookie(res, user._id)
        res.status(201).json({
            success: true,
            message: "User created Successfully",
            user: {
                ...user._doc,
                password: undefined,
            }
        })

    } catch (error) {
        console.log("error in signup", error)
        next(error)
    }
}

export const verifyEmail = async (req, res, next) => {
    const { token } = req.body
    try {
        const user = await verifyEmailService(token)

        res.status(200).json({
            success: true,
            message: "Email successfully verified",
            user: {
                ...user._doc,
                password: undefined
            },
        })
    } catch (error) {
        console.log("error in verify-email", error)
        next(error)
    }
}

export const login = async (req, res, next) => {
    const { email, password } = req.body
    try {
        const user = await loginService(
            email,
            password
        )
        generateTokenAndSetCookie(res, user._id)

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
        next(error);
    }
}

export const logout = async (_, res) => {
    res.clearCookie("token")
    res.status(200).json({ success: true, message: "Logged out successfully" })
}

export const forgotPassword = async (req, res, next) => {
    const { email } = req.body
    try {
        const user = await forgotPasswordService(email)

        res.status(200).json({
            success: true,
            message: "Password reset request sent Successfully",
            user: {
                ...user._doc,
                password: undefined,
            }
        })
        
    } catch (error) {
        console.log("Error in forgotPassword ", error)
        next(error);
    }
}

export const resetPassword = async (req, res, next) => {
    const { token } = req.params
    const { password } = req.body
    try {
        const user = await resetPasswordService(
            token,
            password
        )
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
        next(error)
    }
}

export const resetVerificationToken = async (req, res) => {
    const { email } = req.body
    try {
        const user = resetVerificationTokenService(email)

        res.status(201).json({
            success: true,
            message: "Verification token reset Successfully",
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