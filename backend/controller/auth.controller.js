import {
    findUserByEmail,
    findUserById,
    registerUser,
} from "../DAL/users.DAL.js";
import { createToken } from "../utils/generateToken.js";
import { comparePass } from "../utils/hashPassword.js";

export async function register(req, res) {
    const { email, password } = req.body;
    const exist = await findUserByEmail(email);
    if (exist)
        return res
            .status(400)
            .json({ success: false, message: "user already exist" });
    const user = await registerUser(email, password);
    const token = createToken(user);
    res.status(201).json({ success: true, data: { user, token } });
}

export async function login(req, res) {
    const user = await findUserByEmail(req.body.email);
    if (!user)
        return res.status(401).json({ success: false, message: "invalid " });
    const compare = await comparePass(req.body.password, user.passwordHash);
    if (!compare)
        return res.status(401).json({ success: false, message: "invalid " });
    const token = createToken(user);
    delete user.passwordHash;
    res.status(200).json({ success: true, data: { user, token } });
}

export async function getMe(req, res) {
    const user = await findUserById(req.user.id);
    if (!user)
        return res
            .status(400)
            .json({ success: false, message: "user not found" });
    delete user.passwordHash;
    res.status(200).json({ success: true, data: user });
}
