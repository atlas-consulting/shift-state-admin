import * as Yup from "yup";

export const PERSISTED_EMAIL_CLIENT = Yup.object({
  id: Yup.number().required(),
  alias: Yup.string().required(),
  accessToken: Yup.string().nullable(),
  refreshToken: Yup.string().nullable(),
  clientId: Yup.string().nullable(),
  customerId: Yup.string().nullable(),
  clientEmail: Yup.string().nullable(),
  clientSecret: Yup.string().nullable(),
  domain: Yup.string().nullable(),
  type: Yup.object({
    description: Yup.string().required(),
  }),
  connectedFilters: Yup.array().required(),
});

export const NEW_EMAIL_CLIENT = Yup.object({
  alias: Yup.string().required(),
  emailClientTypeId: Yup.number().required(),
  clientId: Yup.string().nullable(),
  customerId: Yup.string().nullable(),
  clientEmail: Yup.string().nullable(),
  clientSecret: Yup.string().nullable(),
  domain: Yup.string().nullable(),
});

export const FETCH_EMAIL_CLIENTS_SUCCESS_RESPONSE = Yup.object({
  data: Yup.array(PERSISTED_EMAIL_CLIENT).required(),
});
