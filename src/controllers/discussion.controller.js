import { createDiscussionService } from "../services/discussion.service.js";

export const createDiscussion = async (req, res, next) => {
    try {
        const discussion = await createDiscussionService(
            req.params.id,
            req.user.id,
            req.body.content
        )

        res.status(201).json({
            success: true,
            data: discussion
        })
    } catch (error) {
        next(error)
    }
}