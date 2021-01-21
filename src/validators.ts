import * as Yup from "yup";

export const signInResponse = Yup.object({
  message: Yup.string().required(),
  data: Yup.object({
    token: Yup.string().required(),
  }),
});
export const messageResponse = Yup.object({
  message: Yup.string().required(),
});
