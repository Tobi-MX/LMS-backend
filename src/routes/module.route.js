import express from 'express'

import { getModule, updateModule, deleteModule } from '../controllers/module.controller.js'

import { authenticate } from "../middleware/authenticate.middleware.js"
import { authorize } from '../middleware/authorize.middleware.js'

const router = express.Router()

/* ---------- PUBLIC ROUTES ---------- */
router.get("/:id", getModule)


/* ---------- AUTH REQUIRED ---------- */
router.use(authenticate, authorize("instructor", "admin"))

router.patch("/:id", updateModule)
router.delete("/:id", deleteModule)



export default router