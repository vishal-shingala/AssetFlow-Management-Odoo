import { z } from "zod";

export const createBookingSchema = z.object({
  asset_id: z
    .number({ required_error: "asset_id is required" })
    .int()
    .positive(),
  employee_id: z
    .number({ required_error: "employee_id is required" })
    .int()
    .positive(),
  start_time: z
    .string({ required_error: "start_time is required" })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid start_time format",
    }),
  end_time: z
    .string({ required_error: "end_time is required" })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid end_time format",
    }),
  purpose: z.string().max(1000).optional().nullable(),
});

export const updateBookingSchema = z.object({
  asset_id: z.number().int().positive().optional(),
  employee_id: z.number().int().positive().optional(),
  start_time: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid start_time format",
    })
    .optional(),
  end_time: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid end_time format",
    })
    .optional(),
  purpose: z.string().max(1000).optional().nullable(),
  status: z.enum(["UPCOMING", "ONGOING", "COMPLETED", "CANCELLED"]).optional(),
});

export const bookingIdParamSchema = z.object({
  id: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().positive()),
});
