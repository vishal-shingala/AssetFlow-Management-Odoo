import { query } from "../config/database.js";

/**
 * Check if the given asset is booked during the requested timeframe.
 * Parameterized query rejects overlapping bookings while ignoring CANCELLED bookings.
 */
export const checkOverlappingBooking = async (
  assetId,
  startTime,
  endTime,
  excludeBookingId = null,
) => {
  const sql = `
    SELECT EXISTS (
      SELECT 1 FROM resource_bookings
      WHERE asset_id = $1
        AND status != 'CANCELLED'
        AND start_time < $3
        AND end_time > $2
        AND ($4::int IS NULL OR booking_id != $4)
    ) AS is_overlapping
  `;
  const result = await query(sql, [
    assetId,
    startTime,
    endTime,
    excludeBookingId,
  ]);
  return result.rows[0].is_overlapping;
};

/**
 * Get detailed booking list, joining with assets, categories, users, and departments.
 */
export const getBookings = async (queryParams = {}) => {
  const { employee_id, asset_id, status } = queryParams;
  let sql = `
    SELECT 
      rb.booking_id,
      rb.asset_id,
      rb.employee_id,
      rb.start_time,
      rb.end_time,
      rb.purpose,
      rb.status,
      a.asset_name as resource_name,
      a.asset_tag,
      a.location,
      c.name as resource_type,
      u.name as employee_name,
      u.email as employee_email,
      d.name as department_name
    FROM resource_bookings rb
    JOIN assets a ON rb.asset_id = a.id
    LEFT JOIN asset_categories c ON a.category_id = c.category_id
    JOIN users u ON rb.employee_id = u.user_id
    LEFT JOIN departments d ON u.department_id = d.department_id
  `;

  const conditions = [];
  const values = [];
  let paramIndex = 1;

  if (employee_id) {
    conditions.push(`rb.employee_id = $${paramIndex}`);
    values.push(employee_id);
    paramIndex++;
  }

  if (asset_id) {
    conditions.push(`rb.asset_id = $${paramIndex}`);
    values.push(asset_id);
    paramIndex++;
  }

  if (status) {
    conditions.push(`rb.status = $${paramIndex}`);
    values.push(status);
    paramIndex++;
  }

  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }

  sql += " ORDER BY rb.start_time DESC";

  const result = await query(sql, values);
  return result.rows;
};

/**
 * Get detailed booking by ID.
 */
export const getBookingById = async (id) => {
  const sql = `
    SELECT 
      rb.booking_id,
      rb.asset_id,
      rb.employee_id,
      rb.start_time,
      rb.end_time,
      rb.purpose,
      rb.status,
      a.asset_name as resource_name,
      a.asset_tag,
      a.location,
      c.name as resource_type,
      u.name as employee_name,
      u.email as employee_email,
      d.name as department_name
    FROM resource_bookings rb
    JOIN assets a ON rb.asset_id = a.id
    LEFT JOIN asset_categories c ON a.category_id = c.category_id
    JOIN users u ON rb.employee_id = u.user_id
    LEFT JOIN departments d ON u.department_id = d.department_id
    WHERE rb.booking_id = $1
  `;
  const result = await query(sql, [id]);
  return result.rows[0] || null;
};

/**
 * Create a new resource booking after performing all business validations.
 */
export const createBooking = async (bookingData) => {
  const { asset_id, employee_id, start_time, end_time, purpose } = bookingData;

  const start = new Date(start_time);
  const end = new Date(end_time);

  // Business Rule 2: Booking start time must be less than booking end time
  if (start >= end) {
    const error = new Error(
      "Booking start time must be less than Booking end time.",
    );
    error.statusCode = 400;
    throw error;
  }

  // Business Rule 6 & 1: Asset must exist and only shared assets can be booked
  const assetSql = "SELECT is_shared FROM assets WHERE id = $1";
  const assetResult = await query(assetSql, [asset_id]);
  if (assetResult.rows.length === 0) {
    const error = new Error(`Asset with ID ${asset_id} does not exist.`);
    error.statusCode = 404;
    throw error;
  }
  if (!assetResult.rows[0].is_shared) {
    const error = new Error(
      "Only assets having is_shared = true can be booked.",
    );
    error.statusCode = 400;
    throw error;
  }

  // Business Rule 5: Employee must exist
  const employeeSql = "SELECT 1 FROM users WHERE user_id = $1";
  const employeeResult = await query(employeeSql, [employee_id]);
  if (employeeResult.rows.length === 0) {
    const error = new Error(`Employee with ID ${employee_id} does not exist.`);
    error.statusCode = 404;
    throw error;
  }

  // Business Rule 4 & 3: Reject overlapping bookings (cancelled bookings don't block)
  const isOverlapping = await checkOverlappingBooking(asset_id, start, end);
  if (isOverlapping) {
    const error = new Error(
      "Selected time slot overlaps with an existing booking.",
    );
    error.statusCode = 409;
    throw error;
  }

  // Insert resource booking
  const insertSql = `
    INSERT INTO resource_bookings (asset_id, employee_id, start_time, end_time, purpose, status)
    VALUES ($1, $2, $3, $4, $5, 'UPCOMING')
    RETURNING *
  `;
  const insertResult = await query(insertSql, [
    asset_id,
    employee_id,
    start,
    end,
    purpose,
  ]);

  return getBookingById(insertResult.rows[0].booking_id);
};

/**
 * Update an existing resource booking and validate updates.
 */
export const updateBooking = async (id, bookingData) => {
  const existingBooking = await getBookingById(id);
  if (!existingBooking) {
    const error = new Error(`Booking with ID ${id} not found.`);
    error.statusCode = 404;
    throw error;
  }

  const asset_id =
    bookingData.asset_id !== undefined
      ? bookingData.asset_id
      : existingBooking.asset_id;
  const employee_id =
    bookingData.employee_id !== undefined
      ? bookingData.employee_id
      : existingBooking.employee_id;
  const start_time =
    bookingData.start_time !== undefined
      ? bookingData.start_time
      : existingBooking.start_time;
  const end_time =
    bookingData.end_time !== undefined
      ? bookingData.end_time
      : existingBooking.end_time;
  const purpose =
    bookingData.purpose !== undefined
      ? bookingData.purpose
      : existingBooking.purpose;
  const status =
    bookingData.status !== undefined
      ? bookingData.status
      : existingBooking.status;

  const start = new Date(start_time);
  const end = new Date(end_time);

  // Business Rule 2: Booking start time must be less than booking end time
  if (start >= end) {
    const error = new Error(
      "Booking start time must be less than Booking end time.",
    );
    error.statusCode = 400;
    throw error;
  }

  // Business Rule 6 & 1: Asset must exist and only shared assets can be booked
  if (bookingData.asset_id !== undefined) {
    const assetSql = "SELECT is_shared FROM assets WHERE id = $1";
    const assetResult = await query(assetSql, [asset_id]);
    if (assetResult.rows.length === 0) {
      const error = new Error(`Asset with ID ${asset_id} does not exist.`);
      error.statusCode = 404;
      throw error;
    }
    if (!assetResult.rows[0].is_shared) {
      const error = new Error(
        "Only assets having is_shared = true can be booked.",
      );
      error.statusCode = 400;
      throw error;
    }
  }

  // Business Rule 5: Employee must exist
  if (bookingData.employee_id !== undefined) {
    const employeeSql = "SELECT 1 FROM users WHERE user_id = $1";
    const employeeResult = await query(employeeSql, [employee_id]);
    if (employeeResult.rows.length === 0) {
      const error = new Error(
        `Employee with ID ${employee_id} does not exist.`,
      );
      error.statusCode = 404;
      throw error;
    }
  }

  // Business Rule 4 & 3: Reject overlapping bookings (excluding the booking itself, ignoring cancel status)
  if (status !== "CANCELLED") {
    const isOverlapping = await checkOverlappingBooking(
      asset_id,
      start,
      end,
      id,
    );
    if (isOverlapping) {
      const error = new Error(
        "Selected time slot overlaps with an existing booking.",
      );
      error.statusCode = 409;
      throw error;
    }
  }

  // Perform update
  const updateSql = `
    UPDATE resource_bookings
    SET asset_id = $1, employee_id = $2, start_time = $3, end_time = $4, purpose = $5, status = $6
    WHERE booking_id = $7
    RETURNING *
  `;
  await query(updateSql, [
    asset_id,
    employee_id,
    start,
    end,
    purpose,
    status,
    id,
  ]);

  return getBookingById(id);
};

/**
 * Cancel a booking by setting its status to CANCELLED.
 */
export const cancelBooking = async (id) => {
  const existingBooking = await getBookingById(id);
  if (!existingBooking) {
    const error = new Error(`Booking with ID ${id} not found.`);
    error.statusCode = 404;
    throw error;
  }

  const updateSql = `
    UPDATE resource_bookings
    SET status = 'CANCELLED'
    WHERE booking_id = $1
    RETURNING *
  `;
  await query(updateSql, [id]);

  return getBookingById(id);
};

/**
 * Delete a booking.
 */
export const deleteBooking = async (id) => {
  const existingBooking = await getBookingById(id);
  if (!existingBooking) {
    const error = new Error(`Booking with ID ${id} not found.`);
    error.statusCode = 404;
    throw error;
  }

  const deleteSql = "DELETE FROM resource_bookings WHERE booking_id = $1";
  await query(deleteSql, [id]);

  return true;
};
