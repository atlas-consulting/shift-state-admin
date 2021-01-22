import * as Yup from "yup";

export const CREATE_EMAIL_CLIENT = Yup.object({
  alias: Yup.string().required(),
  emailClientTypeId: Yup.number().required(),
  accountId: Yup.number().required(),
  credentialToken: Yup.string().nullable(true).default(null),
  credentialSecret: Yup.string().nullable(true).default(null),
});

export const EMAIL_CLIENT_FILTERS = Yup.object({
  emailClientId: Yup.number().required(),
});

export const APPLY_FILTER_TO_CLIENT = Yup.object({
  filterId: Yup.number().required(),
  emailClientId: Yup.number().required(),
});
