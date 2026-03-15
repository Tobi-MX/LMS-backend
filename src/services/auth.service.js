import { User } from "../models/User.model.js"
import bcryptjs from 'bcryptjs'
import crypto from "crypto"
import ENV from "../config/env.js"
import { NotFoundError, ForbiddenError, BadRequestError, ConflictError } from "../error/AppError.js";

import { generateVerificationToken } from "../utils/generateVerificationCode.js"
import { generateTokenAndSetCookie } from "../utils/generateVerificationToken.js"
import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendResetSuccessEmail } from "../emails/emailHandler.js"


export const signupService = async (name, email, password, role) => {
    if (!name || !email || !password) {
        throw new BadRequestError("All fields are required")
    }
    if (password.length < 6) {
        throw new BadRequestError("Password should be at least 6 characters")
    }

    // check if emailis valid: regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new BadRequestError("Invalid email format")
    }

    const userAlreadyExists = await User.findOne({ email })
    if (userAlreadyExists) {
        throw new ConflictError("User already exists")
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
    await sendVerificationEmail(user.email, verificationToken)
    await user.save()
    return user
}

export const verifyEmailService = async (token) => {
    const user = await User.findOne({
        verificationToken: token,
        verificationTokenExpiresAt: { $gt: Date.now() }
    })

    if (!user) {
        throw new NotFoundError("Invalid or expired verification token")
    }

    user.isVerified = true
    user.verificationToken = undefined
    user.verificationTokenExpiresAt = undefined
    await user.save()


    await sendWelcomeEmail(user.email, user.name)
    return user
}

export const loginService = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new NotFoundError("Invalid credentials")
    }
    const isPasswordValid = await bcryptjs.compare(password, user.password)
    if (!isPasswordValid) {
        throw new NotFoundError("Invalid credentials")
    }
    if (user.role === "instructor" && (!user.isVerified || !user.isApproved)) {
        throw new ForbiddenError("Verify email and wait for approval")
    }

    user.lastLogin = new Date()
    await user.save()
    return user
}