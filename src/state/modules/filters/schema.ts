import * as Yup from 'yup'
import { PERSISTED_EMAIL_CLIENT } from '../email-clients/schema'

export const PERSISTED_FILTER_SCHEMA = Yup.object({
    id: Yup.number().required(),
    description: Yup.string().required(),
    filterConfiguration: Yup.object().required(),
    createdAt: Yup.string().required(),
    connectedEmailClients: Yup.array(PERSISTED_EMAIL_CLIENT)
})

export const PERSISTED_FILTERS_SCHEMA = Yup.array(PERSISTED_FILTER_SCHEMA)

export const FETCH_FILTERS_SUCCESS_RESPONSE = Yup.object({
    data: PERSISTED_FILTERS_SCHEMA
})