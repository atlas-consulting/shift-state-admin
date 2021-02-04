import { RootState } from "../../rootReducer";


export const selectFilters = ({ filters: { filters } }: RootState) => filters

export const selectFiltersList = (state: RootState) => Object.values(selectFilters(state))

export const selectHastFilters = (state: RootState) => !!selectFiltersList(state).length