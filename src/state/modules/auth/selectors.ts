import jwtDecode from "jwt-decode";
import { Account } from "./types";
import { ACCOUNT } from "./schema";
import { RootState } from "../../rootReducer";

export const selectAuth = (state: RootState) => {
  return state.auth;
};

export const selectAccountDetails = (state: RootState) => {
  const token = selectToken(state);
  if (!token) return { id: 0, emailAddress: "unknown@error.com" } as Account;
  const result = jwtDecode(token);
  const { account } = ACCOUNT.validateSync(result);
  return account;
};

export const selectIsAuthenticated = (state: RootState) => {
  return !!selectAuth(state).token;
};

export const selectToken = (state: RootState) => {
  return selectAuth(state).token;
};
