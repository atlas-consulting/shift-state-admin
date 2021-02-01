import * as Yup from "yup";

export const CREATE_EMAIL_CLIENT = Yup.object({
  alias: Yup.string().required(),
  emailClientTypeId: Yup.number().required(),
  accountId: Yup.number().required(),
  accessToken: Yup.string().nullable(true).default(null),
  refreshToken: Yup.string().nullable(true).default(null),
});

export const EMAIL_CLIENT_FILTERS = Yup.object({
  emailClientId: Yup.number().required(),
});

export const APPLY_FILTER_TO_CLIENT = Yup.object({
  filterId: Yup.number().required(),
  emailClientId: Yup.number().required(),
});

export const EMAIL_CLIENT_QUERY = Yup.object({
  code: Yup.string().required(),
  state: Yup.string().required(),
});

export const EMAIL_CLIENT_STATE = Yup.object({
  clientType: Yup.string().required(),
  emailClientId: Yup.number().required(),
});
