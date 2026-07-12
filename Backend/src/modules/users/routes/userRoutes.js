import express from 'express';
import * as controller from '../controllers/userController.js';
import { userFilterSchema } from '../schemas/userSchemas.js';

const router = express.Router();

// Get all users with optional filters
router.get('/', controller.getUsers);

// Get users by role (e.g., EMPLOYEE for department head selection)
router.get('/role/:role', controller.getUsersByRole);

// Get user by ID
router.get('/:id', controller.getUserById);

// Create user
router.post('/', controller.createUser);

// Update user
router.put('/:id', controller.updateUser);

// Delete user
router.delete('/:id', controller.deleteUser);

export default router;
