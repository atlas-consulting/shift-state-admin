import * as Yup from "yup";

export const signInResponse = Yup.object({
  message: Yup.string().required(),
  data: Yup.object({
    token: Yup.string().required(),
  }),
});

export const ACCOUNT = Yup.object({
  account: Yup.object({
    id: Yup.number().required(),
    emailAddress: Yup.string().required(),
  }).required(),
});
