import { employees } from '../data/employees';
export const employeeService = {
  getAll: async () => employees,
  getById: async (id) => employees.find((e) => e.id === id),
  create: async (data) => ({ ...data, id: Date.now() }),
  update: async (id, data) => ({ ...data, id }),
  delete: async (id) => ({ success: true, id }),
};
