import { updateUserService } from "../services/users.service.js";

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