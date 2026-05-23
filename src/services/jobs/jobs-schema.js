/* eslint-disable camelcase */
import Joi from 'joi';

export const createJobSchema = Joi.object({
  categoryId: Joi.string().optional().allow(null, ''),
  title: Joi.string().min(3).max(255).required().messages({
    'string.min': 'Judul minimal 3 karakter',
    'any.required': 'Judul lowongan wajib diisi',
  }),
  description: Joi.string().optional().allow(''),
  jobType: Joi.string().valid('full-time', 'part-time', 'freelance', 'internship').default('full-time'),
  experienceLevel: Joi.string().valid('entry', 'mid', 'senior').default('entry'),
  locationType: Joi.string().valid('onsite', 'remote', 'hybrid').default('onsite'),
  status: Joi.string().valid('open', 'closed').default('open'),
}).options({ abortEarly: false });

export const updateJobSchema = Joi.object({
  categoryId: Joi.string().optional().allow(null, ''),
  title: Joi.string().min(3).max(255).optional(),
  description: Joi.string().optional().allow(''),
  jobType: Joi.string().valid('full-time', 'part-time', 'freelance', 'internship').optional(),
  experienceLevel: Joi.string().valid('entry', 'mid', 'senior').optional(),
  locationType: Joi.string().valid('onsite', 'remote', 'hybrid').optional(),
  status: Joi.string().valid('open', 'closed').optional(),
}).min(1).options({ abortEarly: false }).messages({
  'object.min': 'Minimal satu field harus disertakan',
});

export const listJobsQuerySchema = Joi.object({
  category_id: Joi.string(),
  company_id: Joi.string(),
  title: Joi.string(),
  description: Joi.string(),
  job_type: Joi.string().valid('full-time', 'part-time', 'contract'),
  experience_level: Joi.string().valid('entry', 'mid', 'senior'),
  location_type: Joi.string().valid('remote', 'onsite', 'hybrid'),
  location_city: Joi.string(),
  salary_min: Joi.number().integer(),
  salary_max: Joi.number().integer(),
  is_salary_visible: Joi.boolean(),
  status: Joi.string().valid('open', 'closed'),
  search: Joi.string().optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});