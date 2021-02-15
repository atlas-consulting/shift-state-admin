import { RootState } from "../../rootReducer";

export const selectEmailClients = ({
  emailClients: { emailClients },
}: RootState) => emailClients;

export const selectEmailClientsList = (state: RootState) =>
  Object.values(selectEmailClients(state));

export const selectEmailClientById = (emailClientId: number) => (
  state: RootState
) => selectEmailClients(state)[emailClientId];

export const selectHasEmailClients = (state: RootState) =>
  !!selectEmailClientsList(state).length;

export const selectEmailClientsConnectedFilters = (emailClientId: number) =>
  (state: RootState) => selectEmailClientById(emailClientId)(state).connectedFilters.map(f => f.filter.id)
