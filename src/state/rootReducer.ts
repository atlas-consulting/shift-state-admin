import { combineReducers } from "redux";
import { authReducer } from "./modules/auth";
import { AuthState } from "./modules/auth/types";
import { emailClientsReducer } from "./modules/email-clients";
import { EmailClientState } from "./modules/email-clients/types";
import { FilterState } from './modules/filters/types'
import { filtersReducer } from "./modules/filters";

const rootReducer = combineReducers({
  auth: authReducer,
  emailClients: emailClientsReducer,
  filters: filtersReducer
});

export type RootState = {
  auth: AuthState;
  emailClients: EmailClientState;
  filters: FilterState
};

export default rootReducer;
