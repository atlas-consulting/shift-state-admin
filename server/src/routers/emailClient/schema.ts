import * as Yup from "yup";

export const CREATE_EMAIL_CLIENT = Yup.object({
  alias: Yup.string().required(),
  emailClientTypeId: Yup.number().required(),
  accountId: Yup.number().required(),
  credentialToken: Yup.string().nullable(true).default(null),
  credentialSecret: Yup.string().nullable(true).default(null),
});
