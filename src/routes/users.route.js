import express from 'express'
import { upload } from '../lib/multer.js'

import { authenticate } from "../middleware/authenticate.middleware.js"
import { updateMyProfile } from '../controllers/user.controller.js'

const router = express.Router()

router.use(authenticate)

router.patch("/me", upload.single("profilePic"), updateMyProfile)
//router.get("/me", getMyProfile)

export default router