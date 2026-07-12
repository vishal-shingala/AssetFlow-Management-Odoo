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

const router = express.Router();

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
router.delete(
  "/:id",
  validateParams(bookingIdParamSchema),
  bookingController.deleteBooking,
);

export default router;
