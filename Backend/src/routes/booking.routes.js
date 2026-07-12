import express from "express";
import * as bookingController from "../controllers/booking.controller.js";
import {
  validateBody,
  validateParams,
} from "../middlewares/validate.middleware.js";
import {
  createBookingSchema,
  updateBookingSchema,
  bookingIdParamSchema,
} from "../validators/booking.validator.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All booking routes require authentication
router.use(authenticate);

// All authenticated roles can view and create bookings (EMPLOYEE, DEPARTMENT_HEAD, ASSET_MANAGER, ADMIN)
router.get("/", bookingController.getBookings);
router.get(
  "/:id",
  validateParams(bookingIdParamSchema),
  bookingController.getBookingById,
);
router.post(
  "/",
  validateBody(createBookingSchema),
  bookingController.createBooking,
);
router.put(
  "/:id",
  validateParams(bookingIdParamSchema),
  validateBody(updateBookingSchema),
  bookingController.updateBooking,
);
router.patch(
  "/:id/cancel",
  validateParams(bookingIdParamSchema),
  bookingController.cancelBooking,
);
// Only Asset Manager and Admin can hard-delete bookings
router.delete(
  "/:id",
  authorize(["ASSET_MANAGER", "ADMIN"]),
  validateParams(bookingIdParamSchema),
  bookingController.deleteBooking,
);

export default router;
