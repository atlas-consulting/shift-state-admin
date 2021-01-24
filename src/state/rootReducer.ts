import { combineReducers } from "redux";
import { authReducer } from "./modules/auth";
import { AuthState } from "./modules/auth/types";
import { emailClientsReducer } from "./modules/email-clients";
import { EmailClientState } from "./modules/email-clients/types";

const rootReducer = combineReducers({
  auth: authReducer,
  emailClients: emailClientsReducer,
});

export type RootState = {
  auth: AuthState;
  emailClients: EmailClientState;
};

export default rootReducer;
