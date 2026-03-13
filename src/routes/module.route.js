import express from 'express'

import { authenticate } from "../middleware/authenticate.middleware.js"
//import { authorize } from '../middleware/authorize.middleware.js'

const router = express.Router()

router.use(authenticate)

export default router