import * as yup from "yup";

export const CREATE_USER = yup.object({
  emailAddress: yup.string().email().required(),
  password: yup.string().required(),
});
