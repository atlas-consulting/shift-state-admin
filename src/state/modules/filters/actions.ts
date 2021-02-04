import fetch from 'isomorphic-fetch'
import { FetchFiltersAction, FetchFiltersErrorAction, FilterRoutes, Filters, FiltersActionTypes, FilterServiceResponseTypes, FiltersThunkResult, ReceiveFiltersAction } from './types'
import { createShiftState } from '../service'
import { FETCH_FILTERS_SUCCESS_RESPONSE } from './schema'


export const fetchFiltersAction = (): FetchFiltersAction => ({
    type: FiltersActionTypes.FETCH_FILTERS
})

export const receiveFiltersAction = (filters: Filters): ReceiveFiltersAction => ({
    type: FiltersActionTypes.RECEIVE_FILTERS,
    payload: filters
})

export const receiveFiltersErrorAction = (error: unknown): FetchFiltersErrorAction => ({
    type: FiltersActionTypes.FETCH_FILTERS_ERROR,
    payload: error as string
})

export function fetchFilters(token: string): FiltersThunkResult<void> {
    return async (dispatch) => {
        dispatch(fetchFiltersAction())
        const response = await fetch(FilterRoutes.FILTERS, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        switch (response.status) {
            case 500:
            case 400:
            case 200:
                const data = await response.json()
                const {
                    data: filters
                } = await FETCH_FILTERS_SUCCESS_RESPONSE.validate(data)
                dispatch(receiveFiltersAction(filters))
        }
    }
}