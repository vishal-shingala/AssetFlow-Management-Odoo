import * as authService from '../services/authService.js';

export const signup = async (req, res, next) => {
  try {
    const user = await authService.signupService(req.body);
    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await authService.loginService(req.body);
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
