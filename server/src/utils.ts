import { hash, compare } from "bcrypt";
import { promisify } from "util";

export const encryptString = promisify(hash);
export const doesMatchHash = promisify(compare);
