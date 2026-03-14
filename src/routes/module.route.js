import express from 'express'

import { getModule, updateModule } from '../controllers/module.controller.js'

import { authenticate } from "../middleware/authenticate.middleware.js"
import { authorize } from '../middleware/authorize.middleware.js'

const router = express.Router()

router.get("/:id", getModule)

router.patch("/:id", authenticate, authorize("instructor", "admin"), updateModule)



export default router