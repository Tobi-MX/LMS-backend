import { resendClient, sender } from "../lib/resend.js";
import { VERIFICATION_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE } from "./emailTemplates.js";

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
        console.error("Error sending verification email:", error)
        throw new Error("Failed to send verification email")
    }

    console.log("Welcome email sent successfully", data)
}