import { resendClient, sender } from "../lib/resend.js";
import { VERIFICATION_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE } from "./emailTemplates.js";

export const sendVerificationEmail = async (email, verificationToken) => {
    const { data, error } = await resendClient.emails.send({
        from: `${sender.name} <${sender.email}>`,
        to: email,
        subject: "Verify your email",
        html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken)
    })

    if (error) {
        console.error("Error sending verification email:", error)
        throw new Error("Failed to send verification email")
    }

    console.log("Verification email sent successfully", data)
}

export const sendWelcomeEmail = async (email, name) => {
    const { data, error } = await resendClient.emails.send({
        from: `${sender.name} <${sender.email}>`,
        to: email,
        subject: "Welcome to AI-LMS",
        html: WELCOME_EMAIL_TEMPLATE.replace("{name}", name)
    })

    if (error) {
        console.error("Error sending welcome email:", error)
        throw new Error("Failed to send welcome email")
    }

    console.log("Welcome email sent successfully", data)
}

export const sendPasswordResetEmail = async (email, resetURL) => {
    const { data, error } = await resendClient.emails.send({
        from: `${sender.name} <${sender.email}>`,
        to: email,
        subject: "Password Reset",
        html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL)
    })

    if (error) {
        console.error("Error sending reset password email:", error)
        throw new Error("Failed to send reset password email")
    }

    console.log("Password reset request sent successfully", data)
}

export const sendResetSuccessEmail = async (email) => {
    const { data, error } = await resendClient.emails.send({
        from: `${sender.name} <${sender.email}>`,
        to: email,
        subject: "Password Reset Successful",
        html: PASSWORD_RESET_SUCCESS_TEMPLATE
    })

    if (error) {
        console.error("Error sending reset password success email:", error)
        throw new Error("Failed to send reset password success email")
    }

    console.log("Password reset success sent successfully", data)
}