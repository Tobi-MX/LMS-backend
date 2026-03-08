import express from "express"

import { signup, verifyEmail, login, logout, forgotPassword, resetPassword } from "../controllers/auth.controller.js"
import { authenticate } from "../middleware/authenticate.middleware.js"

const router = express.Router()

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)

router.post("/verify-email", verifyEmail)
router.post("/forgot-password", forgotPassword)
router.post("/reset-password/:token", resetPassword)

export default router