import * as resourceService from "../services/resource.service.js";

export const getResources = async (req, res) => {
  try {
    const data = await resourceService.getResources(req.query);
    return res.status(200).json({
      success: true,
      message: "Resources retrieved successfully",
      data,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to retrieve resources",
      errors: error.errors || null,
    });
  }
};

export const getResourceById = async (req, res) => {
  try {
    const { id } = req.params;
    const resource = await resourceService.getResourceById(id);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: `Resource with ID ${id} not found`,
      });
    }
    return res.status(200).json({
      success: true,
      message: "Resource retrieved successfully",
      data: resource,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to retrieve resource",
      errors: error.errors || null,
    });
  }
};
