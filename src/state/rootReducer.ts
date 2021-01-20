import { combineReducers } from "redux";
import { authReducer, AuthState } from "./modules/auth";

const rootReducer = combineReducers({
  auth: authReducer,
});

export type RootState = {
  auth: AuthState;
};

export default rootReducer;
