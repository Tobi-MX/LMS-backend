import { Discussion } from "../models/Discussion.model.js"
import { Lesson } from "../models/Lesson.model.js"
import { ForbiddenError, NotFoundError } from "../error/AppError.js";

export const createDiscussionService = async (lessonId, userId, content) => {
    const lesson = await Lesson.findById(lessonId)
    if (!lesson) {
        throw new NotFoundError("Lesson not found")
    }

    const discussion = new Discussion({
        lesson: lessonId,
        user: userId,
        content
    })

    discussion.save()
    return discussion
}

export const getLessonDiscussionsService = async (lessonId) => {

    const discussions = await Discussion.find({ lesson: lessonId })
        .populate("user", "name")
        .sort({ createdAt: -1 })

    return discussions
}

export const deleteDiscussionService = async (discussionId, user) => {
    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
        throw new NotFoundError("Discussion not found")
    }

    if (
        discussion.user.toString() !== user._id.toString() &&
        user.role !== "admin"
    ) {
        throw new ForbiddenError("Not authorized")
    }

    await discussion.deleteOne()
}