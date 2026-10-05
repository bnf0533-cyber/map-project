import { ObjectId } from "mongodb";
import { db } from "../db/config.db.js";
import { hashPass } from "../utils/hashPassword.js";

const users = db.collection("users");

export async function findUserByEmail(email) {
    try {
        const exist = await users.findOne({ email: email });
        return exist;
    } catch (error) {
        console.log(error);
    }
}
export async function registerUser(email, pass) {
    const newUser = {
        email,
        passwordHash: await hashPass(pass),
        role: "user",
        createdAt: new Date(),
    };
    const result = await users.insertOne(newUser);
    return { id: result.insertedId, email: newUser.email, role: newUser.role };
}

export async function findUserById(id) {
    return users.findOne({ _id: new ObjectId(id) });
}
