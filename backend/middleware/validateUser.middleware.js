import { userSchema } from "../utils/validation.js";

export function validateUser(req, res, next) {
    const result = userSchema.safeParse(req.body);
    if (!result.success)
        return res
            .status(400)
            .json({ success: false, message: "invalid input" });
    next()
}
