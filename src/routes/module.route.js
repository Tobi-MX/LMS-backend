import express from 'express'

import { getModule } from '../controllers/module.controller.js'

import { authenticate } from "../middleware/authenticate.middleware.js"
import { authorize } from '../middleware/authorize.middleware.js'

const router = express.Router()

router.get("/:id", getModule)



export default router