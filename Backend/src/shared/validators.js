import { z } from "zod";

// User validation schema
export const userSchema = z.object({
  id: z.string().uuid().optional(),
  email: z.string().email("Invalid email address"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must not exceed 50 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    ),
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must not exceed 50 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must not exceed 50 characters"),
  age: z
    .number()
    .int()
    .min(18, "Must be at least 18 years old")
    .max(120, "Invalid age")
    .optional(),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number")
    .optional(),
  role: z.enum(["user", "admin", "moderator"]).default("user"),
  isActive: z.boolean().default(true),
});

// Login validation schema
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Product validation schema
export const productSchema = z.object({
  id: z.string().uuid().optional(),
  name: z
    .string()
    .min(1, "Product name is required")
    .max(200, "Product name must not exceed 200 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must not exceed 2000 characters"),
  price: z
    .number()
    .positive("Price must be positive")
    .max(1000000, "Price must not exceed 1,000,000"),
  stock: z.number().int().min(0, "Stock cannot be negative").default(0),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).max(10, "Maximum 10 tags allowed").optional(),
  isActive: z.boolean().default(true),
});

// Query parameter validation schema
export const paginationSchema = z.object({
  page: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().positive().default(1)),
  limit: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().positive().max(100).default(10)),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
  search: z.string().optional(),
});

// Validation middleware factory
export const validate = (schema) => {
  return (req, res, next) => {
    try {
      // Validate request body
      if (req.body) {
        req.body = schema.parse(req.body);
      }
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));
        return res.status(400).json({
          error: "Validation Error",
          message: "Invalid input data",
          details: errors,
        });
      }
      next(error);
    }
  };
};

// Validate query parameters middleware
export const validateQuery = (schema) => {
  return (req, res, next) => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));
        return res.status(400).json({
          error: "Validation Error",
          message: "Invalid query parameters",
          details: errors,
        });
      }
      next(error);
    }
  };
};

// Validate route parameters middleware
export const validateParams = (schema) => {
  return (req, res, next) => {
    try {
      req.params = schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));
        return res.status(400).json({
          error: "Validation Error",
          message: "Invalid route parameters",
          details: errors,
        });
      }
      next(error);
    }
  };
};

export { z };
