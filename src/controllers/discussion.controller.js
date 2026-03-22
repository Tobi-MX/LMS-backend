import { createDiscussionService, createReplyService, deleteDiscussionService, deleteReplyService, getDiscussionRepliesService, getLessonDiscussionsService } from "../services/discussion.service.js";

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

export const getLessonDiscussions = async (req, res, next) => {
    try {
        const discussion = await getLessonDiscussionsService(
            req.params.id
        )

        res.status(200).json({
            success: true,
            data: discussion
        })
    } catch (error) {
        next(error)
    }
}

export const deleteDiscussion = async (req, res, next) => {
    try {
        await deleteDiscussionService(
            req.params.id,
            req.user
        )

        res.status(200).json({
            success: true,
            message: "Discussion deleted successfully"
        })
    } catch (error) {
        next(error)
    }
}


export const createReply = async (req, res, next) => {
    try {
        const reply = await createReplyService(
            req.params.id,
            req.user.id,
            req.body.content
        )

        res.status(201).json({
            success: true,
            data: reply
        })

    } catch (error) {
        next(error)
    }
}

export const getDiscussionReplies = async (req, res, next) => {
    try {
        const replies = await getDiscussionRepliesService(
            req.params.id
        )

        res.json({
            success: true,
            data: replies
        })

    } catch (error) {
        next(error)
    }
}

export const deleteReply = async (req, res, next) => {
    try {
        await deleteReplyService(
            req.params.replyId,
            req.user
        )

        res.json({
            success: true,
            message: "Reply deleted successfully"
        })

    } catch (error) {
        next(error)
    }
}