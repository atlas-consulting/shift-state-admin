import { FilterState, FiltersActionTypes, FilterAction } from './types'

export function filtersReducer(state: FilterState = { filters: {} }, action: FilterAction): FilterState {
    switch (action.type) {
        case FiltersActionTypes.FETCH_FILTER:
        case FiltersActionTypes.FETCH_FILTERS:
            return state;
        case FiltersActionTypes.RECEIVE_FILTERS:
            const filters = action.payload!.reduce<FilterState['filters']>((acc, filter) => {
                return {
                    ...acc,
                    [filter.id]: filter
                }
            }, {})
            return { ...state, filters }
        default:
            return state;
    }
}