import express from "express"
import { authenticate } from "../middleware/authenticate.middleware.js";
import { createReply, deleteDiscussion, getDiscussionReplies } from "../controllers/discussion.controller.js";

const router = express.Router()

router.delete("/:id",
    authenticate,
    deleteDiscussion
)

//replies
router.post("/:id/replies",
    authenticate,
    createReply
)

router.get("/:id/replies",
    authenticate,
    getDiscussionReplies
)

export default router;