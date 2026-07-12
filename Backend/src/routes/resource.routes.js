import express from "express";
import * as resourceController from "../controllers/resource.controller.js";
import {
  validateQuery,
  validateParams,
} from "../middlewares/validate.middleware.js";
import {
  getResourcesQuerySchema,
  resourceIdParamSchema,
} from "../validators/resource.validator.js";

const router = express.Router();

router.get(
  "/",
  validateQuery(getResourcesQuerySchema),
  resourceController.getResources,
);
router.get(
  "/:id",
  validateParams(resourceIdParamSchema),
  resourceController.getResourceById,
);

export default router;
