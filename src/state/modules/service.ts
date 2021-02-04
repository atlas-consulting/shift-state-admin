import fetch from "isomorphic-fetch";
import { createAuthService } from "./auth/service";
import { createEmailClientService } from './email-clients/service'

type Fetch = typeof fetch;

const ShiftState = {
  auth: createAuthService(fetch),
};

export function createShiftState(fetch: Fetch, token: string) {
  return {
    auth: createAuthService(fetch),
    client: createEmailClientService(fetch, token)
  }
}

export default ShiftState;
