import Joi from 'joi';

export const createCategorySchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  description: Joi.string().allow('', null).optional(),
  status: Joi.string().valid('ACTIVE', 'INACTIVE').default('ACTIVE'),
});

export const updateCategorySchema = Joi.object({
  name: Joi.string().min(1).max(255).optional(),
  description: Joi.string().allow('', null).optional(),
  status: Joi.string().valid('ACTIVE', 'INACTIVE').optional(),
}).min(1);
