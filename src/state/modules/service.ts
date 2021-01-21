import fetch from "isomorphic-fetch";
import { createAuthService } from "./auth/service";

const ShiftState = {
  auth: createAuthService(fetch),
};

export default ShiftState;
