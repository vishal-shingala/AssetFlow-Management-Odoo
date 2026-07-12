import { maintenanceRequests } from '../data/maintenance';
export const maintenanceService = {
  getAll: async () => maintenanceRequests,
  getById: async (id) => maintenanceRequests.find((m) => m.id === id),
  create: async (data) => ({ ...data, id: Date.now() }),
  update: async (id, data) => ({ ...data, id }),
  delete: async (id) => ({ success: true, id }),
};
