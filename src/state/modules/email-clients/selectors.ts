import { RootState } from "../../rootReducer";

export const selectEmailClients = ({
  emailClients: { emailClients },
}: RootState) => emailClients;

export const selectEmailClientsList = (state: RootState) =>
  Object.values(selectEmailClients(state));

export const selectHasEmailClients = (state: RootState) =>
  !!selectEmailClientsList(state).length;
