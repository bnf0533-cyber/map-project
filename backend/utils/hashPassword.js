import { hash, compare } from "bcrypt";

export async function hashPass(pass) {
    return hash(pass, 10);
}

export async function comparePass(pass, hashPass) {
    return compare(pass, hashPass);
}
