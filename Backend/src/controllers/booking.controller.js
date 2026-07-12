import * as bookingService from "../services/booking.service.js";

export const getBookings = async (req, res) => {
  try {
    const data = await bookingService.getBookings(req.query);
    return res.status(200).json({
      success: true,
      message: "Bookings retrieved successfully",
      data,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to retrieve bookings",
      errors: error.errors || null,
    });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await bookingService.getBookingById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `Booking with ID ${id} not found`,
      });
    }
    return res.status(200).json({
      success: true,
      message: "Booking retrieved successfully",
      data: booking,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to retrieve booking",
      errors: error.errors || null,
    });
  }
};

export const createBooking = async (req, res) => {
  try {
    const booking = await bookingService.createBooking(req.body);
    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to create booking",
      errors: error.errors || null,
    });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await bookingService.updateBooking(id, req.body);
    return res.status(200).json({
      success: true,
      message: "Booking updated successfully",
      data: booking,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to update booking",
      errors: error.errors || null,
    });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await bookingService.cancelBooking(id);
    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: booking,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to cancel booking",
      errors: error.errors || null,
    });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    await bookingService.deleteBooking(id);
    return res.status(200).json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to delete booking",
      errors: error.errors || null,
    });
  }
};
