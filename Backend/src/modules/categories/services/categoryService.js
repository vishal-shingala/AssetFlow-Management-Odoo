import * as repo from '../repositories/categoryRepository.js';
import { query } from '../../../config/database.js';
import logger from '../../../config/logger.js';

// Service error helper
class ServiceError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.name = 'ServiceError';
    this.status = status;
  }
}

export const createCategory = async (categoryData) => {
  // Edge case: Check if category name already exists
  const existingCategory = await query(
    'SELECT category_id FROM asset_categories WHERE name = $1 LIMIT 1',
    [categoryData.name.trim()]
  );
  if (existingCategory.rows.length > 0) {
    throw new ServiceError('Category with this name already exists', 409);
  }
  
  const category = await repo.createCategoryRepo(categoryData);
  logger.info('Created category successfully', { categoryId: category.category_id, name: category.name });
  return category;
};

export const getCategories = async (filters) => {
  return repo.getCategoriesRepo(filters);
};

export const getCategoryById = async (id) => {
  const category = await repo.getCategoryByIdRepo(id);
  if (!category) {
    throw new ServiceError(`Category with ID ${id} not found`, 404);
  }
  return category;
};

export const updateCategory = async (id, updateData) => {
  await getCategoryById(id); // Ensure category exists
  
  // Edge case: Check if new name conflicts with existing category
  if (updateData.name) {
    const existingCategory = await query(
      'SELECT category_id FROM asset_categories WHERE name = $1 AND category_id != $2 LIMIT 1',
      [updateData.name.trim(), id]
    );
    if (existingCategory.rows.length > 0) {
      throw new ServiceError('Category with this name already exists', 409);
    }
  }
  
  const updated = await repo.updateCategoryRepo(id, updateData);
  logger.info('Updated category successfully', { categoryId: id });
  return updated;
};

export const deleteCategory = async (id) => {
  await getCategoryById(id);
  const deleted = await repo.deleteCategoryRepo(id);
  if (!deleted) {
    throw new ServiceError(`Failed to delete category ${id}`, 500);
  }
  logger.info('Deleted category successfully', { categoryId: id });
  return { success: true, id };
};

export const getCategoriesByStatus = async (status) => {
  return repo.getCategoriesByStatusRepo(status);
};
