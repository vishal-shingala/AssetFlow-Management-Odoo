import * as departmentService from '../services/departmentService.js';

export const createDepartment = async (req, res, next) => {
  try {
    const department = await departmentService.createDepartment(req.body);
    res.status(201).json({
      success: true,
      message: 'Department created successfully',
      data: department,
    });
  } catch (error) {
    next(error);
  }
};

export const getDepartments = async (req, res, next) => {
  try {
    const result = await departmentService.getDepartments(req.query);
    res.status(200).json({
      success: true,
      message: 'Departments retrieved successfully',
      data: result.departments,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

export const searchDepartments = async (req, res, next) => {
  try {
    const { q, limit } = req.query;
    const departments = await departmentService.searchDepartments(q, limit ? parseInt(limit, 10) : 20);
    res.status(200).json({
      success: true,
      message: 'Search completed successfully',
      data: departments,
    });
  } catch (error) {
    next(error);
  }
};

export const getDepartmentById = async (req, res, next) => {
  try {
    const department = await departmentService.getDepartmentById(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Department retrieved successfully',
      data: department,
    });
  } catch (error) {
    next(error);
  }
};

export const updateDepartment = async (req, res, next) => {
  try {
    const department = await departmentService.updateDepartment(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Department updated successfully',
      data: department,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDepartment = async (req, res, next) => {
  try {
    await departmentService.deleteDepartment(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Department deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getDepartmentsByStatus = async (req, res, next) => {
  try {
    const { status } = req.params;
    const departments = await departmentService.getDepartmentsByStatus(status);
    res.status(200).json({
      success: true,
      message: 'Departments retrieved successfully',
      data: departments,
    });
  } catch (error) {
    next(error);
  }
};

export const getChildDepartments = async (req, res, next) => {
  try {
    const departments = await departmentService.getChildDepartments(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Child departments retrieved successfully',
      data: departments,
    });
  } catch (error) {
    next(error);
  }
};
