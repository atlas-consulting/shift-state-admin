import { RootState } from "../../rootReducer";

export const selectAuth = (state: RootState) => {
  return state.auth;
};

export const selectIsAuthenticated = (state: RootState) => {
  return !!selectAuth(state).token;
};

export const selectToken = (state: RootState) => {
  return selectAuth(state).token;
};
