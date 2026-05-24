/* eslint-disable camelcase */
import Joi from 'joi';

export const createApplicationSchema = Joi.object({
  job_id: Joi.string().required(),
  status: Joi.string().valid('pending', 'accepted', 'rejected').required(),
});

export const updateStatusApplicationSchema =
  Joi.object({
    status: Joi.string()
      .valid('pending', 'accepted', 'rejected')
      .required(),
  });