import * as yup from "yup";

export const createUserRequest = yup.object({
  emailAddress: yup.string().email().required(),
  password: yup.string().required(),
});
