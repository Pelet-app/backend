// src/services/resumes/validator/index.js
import Joi from 'joi';

export const createResumeJsonSchema = Joi.object({
  fileUrl: Joi.string().uri().required().messages({
    'string.uri': 'fileUrl harus berupa URL yang valid',
    'any.required': 'fileUrl wajib diisi',
  }),
  filename: Joi.string().max(255).optional(),
});


