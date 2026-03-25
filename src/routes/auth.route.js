import express from "express"

import { signup, verifyEmail, login, logout, forgotPassword, resetPassword, resetVerificationToken, changePassword } from "../controllers/auth.controller.js"
import { authenticate } from "../middleware/authenticate.middleware.js"

const router = express.Router()

router.get("/check", authenticate, (req, res) => {
    res.status(200).json(req.user)
}) // general check to know if user is authenticated

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)

router.post("/reset-verification", resetVerificationToken)
router.post("/verify-email", verifyEmail)
router.post("/forgot-password", forgotPassword)
router.post("/reset-password/:token", resetPassword)
router.patch("/change-password",
    authenticate, 
    changePassword
)

export default router