import * as Yup from "yup";

export const messageResponse = Yup.object({
  message: Yup.string().required(),
});
