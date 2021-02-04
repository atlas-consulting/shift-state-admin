/**
 * @module filters.service
 */
import fetch from 'isomorphic-fetch'
import { Filter, FilterRoutes, Filters, NewFilter } from "./types";

type Fetch = typeof fetch

export function createFilterService(fetch: Fetch, token: string) {
    const FETCH_PARAMS: RequestInit = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    }
    return {
        create(newFilter: NewFilter, accountId: number) {
            return fetch(FilterRoutes.FILTERS, {
                ...FETCH_PARAMS,
                method: 'POST',
                body: JSON.stringify(newFilter)
            }).then(res => res.json())
        },
        update(filterId: number, update: Partial<Filter>) {
            return fetch(`${FilterRoutes.FILTERS}/${filterId}`, {
                ...FETCH_PARAMS,
                method: 'PUT',
                body: JSON.stringify(update)
            }).then(res => res.json())
        },
        fetchAll(): Promise<Response> {
            return fetch(FilterRoutes.FILTERS, FETCH_PARAMS).then(res => res.json())
        },
        fetchOne(filterId: number) {
            return fetch(`${FilterRoutes.FILTERS}/${filterId}`, FETCH_PARAMS).then(res => res.json())
        },
        remove(filterId: number) {
            return fetch(`${FilterRoutes.FILTERS}/${filterId}`, {
                ...FETCH_PARAMS,
                method: 'DELETE'
            }).then(res => res.json())
        }
    }
}