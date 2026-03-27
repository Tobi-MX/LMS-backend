import { ForbiddenError } from "../error/AppError.js";

export const isVerifiedAndApproved = (req, res, next) => {
    if (!req.user?.isApproved || !req.user?.isVerified) {
        return next(new ForbiddenError("Not Authorized!"));
    }

    next();
};