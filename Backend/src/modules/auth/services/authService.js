import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findUserByEmailRepo, createUserRepo } from '../repositories/authRepository.js';

export const signupService = async (userData) => {
  const { name, email, password } = userData;

  // 1. Check if user already exists
  const existingUser = await findUserByEmailRepo(email);
  if (existingUser) {
    const error = new Error('Email is already registered');
    error.statusCode = 409;
    throw error;
  }

  // 2. Hash the password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // 3. Create the user
  const newUser = await createUserRepo({
    name,
    email,
    password: hashedPassword,
  });

  return newUser;
};

export const loginService = async (loginData) => {
  const { email, password } = loginData;

  // 1. Find user by email
  const user = await findUserByEmailRepo(email);
  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  // 2. Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  // 3. Check if user is active
  if (!user.is_active || user.status === 'INACTIVE') {
    const error = new Error('Your account is deactivated');
    error.statusCode = 403;
    throw error;
  }

  // 4. Generate token
  const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
  const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '24h';
  
  const token = jwt.sign(
    { user_id: user.user_id, email: user.email, role: user.role },
    jwtSecret,
    { expiresIn: jwtExpiresIn }
  );

  // 5. Omit password
  const { password: _, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    token,
  };
};
