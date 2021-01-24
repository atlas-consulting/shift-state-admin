import * as Yup from "yup";

export const GET_CLIENT_AUTH_URL = Yup.object({
  clientType: Yup.string().required(),
  emailClientId: Yup.number().required(),
});

export const GMAIL_CLIENT_TOKEN = Yup.object({
  access_token: Yup.string().required(),
  refresh_token: Yup.string().required(),
  scope: Yup.string().required(),
  token_type: Yup.string().required(),
  expiry_date: Yup.number().required(),
});
