import * as Yup from "yup";

export const CREATE_EMAIL_CLIENT_TYPE = Yup.object({
  description: Yup.string().required(),
});
