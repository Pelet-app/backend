import Joi from 'joi';
import InvariantError from '../../exceptions/invariant-error.js';

export const applicantDataSchema = Joi.object({
  bio: Joi.string().max(2000).optional().allow('', null),
  education: Joi.string().max(500).optional().allow('', null),
  portfolioUrl: Joi.string().uri().optional().allow('', null).messages({
    'string.uri': 'portfolioUrl harus berupa URL valid (https://...)',
  }),
  linkedinUrl: Joi.string().uri().optional().allow('', null).messages({
    'string.uri': 'linkedinUrl harus berupa URL valid (https://linkedin.com/...)',
  }),
}).optional();

// ── Sub-schema JSONB untuk HRD (role: hrd) ────────────────────────────────
export const hrdDataSchema = Joi.object({
  companyName: Joi.string().min(2).max(255).optional(),
  position: Joi.string().max(100).optional().allow('', null),
  companyWebsite: Joi.string().uri().optional().allow('', null).messages({
    'string.uri': 'companyWebsite harus berupa URL valid',
  }),
}).optional();

export const updateProfileSchema = Joi.object({
  fullName: Joi.string().min(2).max(255).optional().messages({
    'string.min': 'fullName minimal 2 karakter',
  }),
  phoneNumber: Joi.string()
    .pattern(/^[0-9+\-() ]{7,20}$/)
    .optional()
    .allow('', null)
    .messages({
      'string.pattern.base': 'Format nomor telepon tidak valid',
    }),
  address: Joi.string().max(500).optional().allow('', null),
  avatarUrl: Joi.string().uri().optional().allow('', null).messages({
    'string.uri': 'avatarUrl harus berupa URL valid',
  }),

  applicantData: applicantDataSchema,
  hrdData: hrdDataSchema,

}).min(1).options({ abortEarly: false }).messages({
  'object.min': 'Minimal satu field harus disertakan untuk update profil',
});

export const validateByRole = (role, payload) => {
  const errors = [];

  if (role === 'user') {
    if (payload.hrdData !== undefined) {
      errors.push('Field hrdData tidak diizinkan untuk role "user"');
    }
  }

  if (role === 'hrd') {
    if (payload.applicantData !== undefined) {
      errors.push('Field applicantData tidak diizinkan untuk role "hrd"');
    }
  }

  if (errors.length > 0) {
    throw new InvariantError(errors.join('; '));
  }
};

export const validateProfile = (req, res, next) => {
  // Layer 1: validasi schema Joi
  const { error, value } = updateProfileSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const message = error.details.map((d) => d.message).join('; ');
    return next(new InvariantError(message));
  }

  // Layer 2: validasi kondisional berdasarkan role dari JWT
  try {
    validateByRole(req.user.role, value);
  } catch (err) {
    return next(err);
  }

  req.body = value; // replace dengan nilai yang sudah disanitasi Joi
  return next();
};