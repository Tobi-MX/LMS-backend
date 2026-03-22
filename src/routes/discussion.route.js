import express from "express"
import { authenticate } from "../middleware/authenticate.middleware.js";
import { createReply, deleteDiscussion, deleteReply, getDiscussionReplies } from "../controllers/discussion.controller.js";

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

router.delete("/replies/:replyId",
    authenticate,
    deleteReply
)

export default router;