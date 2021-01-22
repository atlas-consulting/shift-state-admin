import { Router, Application } from "express";
import { FilterRoutes } from "./types";
import { validateRequestFilters, validateCreateFilter } from "./middleware";
import { VERIFY_TOKEN } from "../auth/strategies";
import { IConfig, http } from "../../core";
import { Filter } from "../../entities/Filter";

export const mount = (application: Application, config: IConfig) => {
  config.LOGGER.info("Mounting Filters Router");
  const filtersRouter = Router();
  filtersRouter
    .get(
      FilterRoutes.FILTERS_BY_ACCOUNT,
      VERIFY_TOKEN,
      validateRequestFilters,
      async (req, res) => {
        config.LOGGER.info("Requesting all filters");
        const allFilters = await Filter.find({
          where: { accountId: req.body.accountId },
        });
        http.handleResponse(res, http.StatusCode.OK, allFilters);
      }
    )
    .post(
      FilterRoutes.FILTERS,
      VERIFY_TOKEN,
      validateCreateFilter,
      async (req, res) => {
        const newFilter = await Filter.create({ ...req.body } as Filter).save();
        http.handleResponse(res, http.StatusCode.CREATED, newFilter);
      }
    );
  application.use(filtersRouter);
};
