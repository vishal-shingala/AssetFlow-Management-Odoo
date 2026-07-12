import { departments } from '../data/departments';
export const departmentService = {
  getAll: async () => departments,
  getById: async (id) => departments.find((d) => d.id === id),
  create: async (data) => ({ ...data, id: Date.now() }),
  update: async (id, data) => ({ ...data, id }),
  delete: async (id) => ({ success: true, id }),
};
