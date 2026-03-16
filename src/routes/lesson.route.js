import express from "express"
import { getLesson, updateLesson, deleteLesson } from "../controllers/lesson.controller.js"

const router = express.Router()

router.get("/:id", getLesson)
router.patch("/:id", updateLesson)
router.delete("/:id", deleteLesson)

export default router;

// Remember every :id in here is for lessons