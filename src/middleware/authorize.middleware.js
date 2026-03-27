import { ForbiddenError } from "../error/AppError";

export const authorize = (...roles) => {
    return (req, res, next) => {

        if (!roles.includes(req.user.role)) {
            return next(new ForbiddenError("Not Authorized"))
        }

        next();
    };
};