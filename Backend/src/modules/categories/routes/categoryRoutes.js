import express from 'express';
import * as categoryController from '../controllers/categoryController.js';

const router = express.Router();

router.post('/', categoryController.createCategory);
router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategoryById);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);
router.get('/status/:status', categoryController.getCategoriesByStatus);

export default router;
