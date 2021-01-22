import * as Yup from "yup";

export const REQUEST_ALL_FILTERS_FOR_ACCOUNT = Yup.object({
  accountId: Yup.number().required(),
});

export const CREATE_NEW_FILTER = Yup.object({
  filterConfiguration: Yup.object().default({}),
  accountId: Yup.number().required(),
  description: Yup.string().required(),
});
