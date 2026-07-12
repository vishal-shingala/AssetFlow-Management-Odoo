import { allocations } from '../data/allocations';
export const allocationService = {
  getAll: async () => allocations,
  getById: async (id) => allocations.find((a) => a.id === id),
  create: async (data) => ({ ...data, id: Date.now() }),
  update: async (id, data) => ({ ...data, id }),
  delete: async (id) => ({ success: true, id }),
};
