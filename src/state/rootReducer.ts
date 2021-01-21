import { combineReducers } from "redux";
import { authReducer } from "./modules/auth";
import { AuthState } from "./modules/auth/types";

const rootReducer = combineReducers({
  auth: authReducer,
});

export type RootState = {
  auth: AuthState;
};

export default rootReducer;
