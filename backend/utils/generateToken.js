import jwt from "jsonwebtoken";
import "dotenv/config";
export function createToken(user) {
    const token = jwt.sign(
        { id: user._id || user.id, role: user.role || user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );
    return token;
}
