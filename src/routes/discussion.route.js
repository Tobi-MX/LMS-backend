import express from "express"
import { authenticate } from "../middleware/authenticate.middleware.js";
import { createReply, deleteDiscussion, deleteReply, getDiscussionReplies } from "../controllers/discussion.controller.js";
import { isVerifiedAndApproved } from "../middleware/verifiedAndApproved.js";

const router = express.Router()

router.delete("/:id",
    authenticate,
    isVerifiedAndApproved,
    deleteDiscussion
)

//replies
router.post("/:id/replies",
    authenticate,
    isVerifiedAndApproved,
    createReply
)

router.get("/:id/replies",
    authenticate,
    isVerifiedAndApproved,
    getDiscussionReplies
)

router.delete("/replies/:replyId",
    authenticate,
    isVerifiedAndApproved,
    deleteReply
)

export default router;