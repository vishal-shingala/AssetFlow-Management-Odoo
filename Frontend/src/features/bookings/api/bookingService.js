import { bookings } from '../data/bookings';
export const bookingService = {
  getAll: async () => bookings,
  getById: async (id) => bookings.find((b) => b.id === id),
  create: async (data) => ({ ...data, id: Date.now() }),
  update: async (id, data) => ({ ...data, id }),
  delete: async (id) => ({ success: true, id }),
};
