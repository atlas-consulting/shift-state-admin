import { hash, compare } from "bcryptjs";
import { promisify } from "util";

export const encryptString = promisify(hash);
export const doesMatchHash = promisify(compare);
