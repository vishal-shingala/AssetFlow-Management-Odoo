import express from 'express';
import { signup, login } from '../controllers/authController.js';
import { signupSchema, loginSchema } from '../schemas/authSchema.js';
import { validate } from '../../../shared/validators.js';

const router = express.Router();

router.post('/signup', validate(signupSchema), signup);
router.post('/login', validate(loginSchema), login);

export default router;
