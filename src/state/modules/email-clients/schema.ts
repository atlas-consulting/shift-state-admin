import * as Yup from "yup";

export const PERSISTED_EMAIL_CLIENT = Yup.object({
  id: Yup.number().required(),
  alias: Yup.string().required(),
  accessToken: Yup.string().nullable(),
  refreshToken: Yup.string().nullable(),
  type: Yup.object({
    description: Yup.string().required(),
  }),
});

export const FETCH_EMAIL_CLIENTS_SUCCESS_RESPONSE = Yup.object({
  data: Yup.array(PERSISTED_EMAIL_CLIENT).required(),
});
