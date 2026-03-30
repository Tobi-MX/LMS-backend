import { User } from "../models/User.model.js"
import { Enrollment } from "../models/Enrollment.model.js";
import { Course } from "../models/Course.model.js";
import { uploadImage, deleteImage } from "../utils/cloudinary.js";
import { NotFoundError, ForbiddenError } from "../error/AppError.js";

export const updateUserService = async (userId, data, file) => {
    const user = await User.findById(userId)

    if (!user) {
        throw new NotFoundError("User not found");
    }
    if (!user.isApproved || !user.isVerified) {
        throw new ForbiddenError("Account is not verified or approved.")
    }
    if (file) {
        if (user.profilePic?.public_id) {
            await deleteImage(user.profilePic.public_id)
        }

        const profilePicUrl = await uploadImage(file)
        user.profilePic = {
            url: profilePicUrl.secure_url,
            public_id: profilePicUrl.public_id
        }
    }

    const allowedFields = [
        "name",
        "bio",
        "profilePic"
    ]

    allowedFields.forEach(field => {
        if (data[field] !== undefined) {
            user[field] = data[field]
        }
    })

    await user.save()
    return user
}

export const getUserProfileService = async (userId) => {
    const user = await User.findById(userId)

    if (!user) {
        throw new NotFoundError("User not found")
    }

    return {
        name: user.name,
        bio: user.bio,
        profilePic: user.profilePic,
        id: user._id
    }
}

export const deleteAccountService = async (userId) => {
    const user = await User.findById(userId)

    if (!user) {
        throw new NotFoundError("User not found")
    }

    if (user.role === "student") {
        await Enrollment.deleteMany({ user: user._id })
        await User.findByIdAndDelete(user._id)
    }

    if (user.role === "instructor") {

        await Course.updateMany(
            { instructor: user._id },
            {
                $set: {
                    instructor: null,
                    instructorName: "Deleted Instructor"
                }
            }
        )

        await User.findByIdAndDelete(user._id)
    }
}