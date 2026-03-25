import { updateUserService, getUserProfileService } from "../services/users.service.js";

export const updateMyProfile = async (req, res, next) => {
    try {
        const updatedUser = await updateUserService(req.user.id, req.body, req.file)

        res.json({
            success: true,
            data: updatedUser
        });

    } catch (err) {
        next(err);
    }
};

export const getMyProfile = async (req, res, next) => {
    try {
        res.json({
            name: req.user.name,
            bio: req.user.bio,
            profilePic: req.user.profilePic
        })
    } catch (error) {
        
    }
}

export const getUserProfile = async (req, res, next) => {
    try {
        const user = await getUserProfileService(
            req.params.id
        )
        res.json({
            success: true,
            data: user
        })
    } catch (error) {
        
    }
}