import express from 'express';
import * as controller from '../controllers/departmentController.js';
import * as schemas from '../schemas/departmentSchemas.js';
import { validate, validateQuery } from '../../../shared/validators.js';

const router = express.Router();

// GET /api/departments/search - Search departments
router.get('/search', controller.searchDepartments);

// POST /api/departments - Create new department
router.post('/', validate(schemas.createDepartmentSchema), controller.createDepartment);

// GET /api/departments - Get paginated departments directory
router.get('/', validateQuery(schemas.departmentFilterSchema), controller.getDepartments);

// GET /api/departments/status/:status - Get departments by status
router.get('/status/:status', controller.getDepartmentsByStatus);

// GET /api/departments/:id - Get department details
router.get('/:id', controller.getDepartmentById);

// GET /api/departments/:id/children - Get child departments
router.get('/:id/children', controller.getChildDepartments);

// PUT /api/departments/:id - Update department details
router.put('/:id', validate(schemas.updateDepartmentSchema), controller.updateDepartment);

// DELETE /api/departments/:id - Delete a department
router.delete('/:id', controller.deleteDepartment);

export default router;
