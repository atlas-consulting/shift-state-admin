import { ThunkAction } from "redux-thunk";
import { Asserts } from "yup";
import { PERSISTED_FILTERS_SCHEMA, PERSISTED_FILTER_SCHEMA } from "./schema";

/* ---------------------------------- Types --------------------------------- */

export type Filter = Asserts<typeof PERSISTED_FILTER_SCHEMA>
export type Filters = Asserts<typeof PERSISTED_FILTERS_SCHEMA>

interface FilterClause {
  type: 'AND' | 'OR';
  id: number;
  value: string
}

export interface NewFilter {
  description: string;
  filterConfiguration: {
    clauses: Record<string, FilterClause>;
    subjectContains: string;
    forwardingAddress: string
  }
}

/* ----------------------------- Types: Actions ----------------------------- */
export enum FiltersActionTypes {
  FETCH_FILTERS = 'FETCH_FILTERS',
  FETCH_FILTERS_ERROR = 'FETCH_FILTERS_ERROR',
  FETCH_FILTER = 'FETCH_FILTER',
  FETCH_FILTER_ERROR = 'FETCH_FILTER_ERROR',
  RECEIVE_FILTERS = 'RECEIVE_FILTERS',
  RECEIVE_NEW_FILTER = 'RECEIVE_NEW_FILTER'
}

export interface FetchFiltersAction {
  type: FiltersActionTypes.FETCH_FILTERS
}
export interface FetchFilterAction {
  type: FiltersActionTypes.FETCH_FILTER
}
export interface FetchFilterErrorAction {
  type: FiltersActionTypes.FETCH_FILTER_ERROR
  payload: string
}
export interface FetchFiltersErrorAction {
  type: FiltersActionTypes.FETCH_FILTERS_ERROR
  payload: string
}
export interface ReceiveFiltersAction {
  type: FiltersActionTypes.RECEIVE_FILTERS
  payload: Filters
}

export interface RecieveFilterAction {
  type: FiltersActionTypes.RECEIVE_NEW_FILTER,
  payload: Filter
}

export type FilterAction = FetchFilterAction | FetchFiltersAction | ReceiveFiltersAction | RecieveFilterAction | FetchFilterErrorAction | FetchFiltersErrorAction

export type FiltersThunkResult<R> = ThunkAction<
  R,
  FilterState,
  undefined,
  FilterAction
>

/* ------------------------------ Types: State ------------------------------ */

export interface FilterState {
  filters: Record<number, Filter>
}


/* ----------------------------- Types: Service ----------------------------- */
export enum FilterServiceResponseTypes {
  RECEIVE_FILTERS = 'RECEIVE_FILTERS',
  RECEIVE_FILTERS_ERROR = 'RECEIVE_FILTERS_ERROR'
}

export interface ReceiveFiltersResponse {
  type: FilterServiceResponseTypes.RECEIVE_FILTERS,
  filters: Filters
}

export interface ReceiveFiltersError {
  type: FilterServiceResponseTypes.RECEIVE_FILTERS_ERROR,
  error: unknown
}

export type FiltersServiceResponse = ReceiveFiltersResponse | ReceiveFiltersError


/* --------------------------------- Routes --------------------------------- */

export enum FilterRoutes {
  FILTERS = "/api/filters",
  FILTERS_BY_ACCOUNT = "/api/filters/accounts/:accountId",
}