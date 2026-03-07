import { Resend } from 'resend';
import ENV from '../config/env.js';

if (!ENV.RESEND_API_KEY) {
    throw new Error("Resend API key is unavailable")
}

export const resendClient = new Resend(ENV.RESEND_API_KEY)

export const sender = {
    email: ENV.EMAIL_FROM,
    name: ENV.EMAIL_FROM_NAME
}