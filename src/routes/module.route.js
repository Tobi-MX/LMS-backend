import express from 'express'

import { createModule } from '../controllers/module.controller.js'

import { authenticate } from "../middleware/authenticate.middleware.js"
import { authorize } from '../middleware/authorize.middleware.js'

const router = express.Router()

/* ---------- AUTH REQUIRED ---------- */



export default router