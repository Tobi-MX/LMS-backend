import express from "express"
import { authenticate } from "../middleware/authenticate.middleware.js"
import { authorize } from "../middleware/authorize.middleware.js"
import {  } from "../controllers/quiz.controller.js"

const router = express.Router()


export default router