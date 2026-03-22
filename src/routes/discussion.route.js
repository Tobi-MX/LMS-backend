import express from "express"
import { authenticate } from "../middleware/authenticate.middleware.js";
import { deleteDiscussion } from "../controllers/discussion.controller.js";

const router = express.Router()

router.delete("/:id",
    authenticate,
    deleteDiscussion
)

export default router;