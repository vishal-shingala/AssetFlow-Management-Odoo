// Asset Service Layer
// Currently using static data. Replace imports with API calls when backend is ready.

import { assets, assetCategories, assetStatuses, assetConditions } from '../data/assets';

export const assetService = {
  getAll: async () => assets,
  getById: async (id) => assets.find((a) => a.id === id),
  create: async (data) => ({ ...data, id: Date.now() }),
  update: async (id, data) => ({ ...data, id }),
  delete: async (id) => ({ success: true, id }),
  getCategories: async () => assetCategories,
  getStatuses: async () => assetStatuses,
  getConditions: async () => assetConditions,
};

export default assetService;
