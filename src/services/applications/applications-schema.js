// /* eslint-disable camelcase */
// import Joi from 'joi';

// export const createApplicationSchema = Joi.object({
//   user_id: Joi.string().required(),
//   job_id: Joi.string().required(),
//   status: Joi.string().valid('pending', 'accepted', 'rejected').required(),
// });

// export const updateApplicationSchema = Joi.object({
//   user_id: Joi.string(),
//   job_id: Joi.string(),
//   status: Joi.string().valid('pending', 'accepted', 'rejected'),
// });