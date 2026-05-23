import Joi from 'joi';

export const registerSchema = Joi.object({

  // ── Field dasar ────────────────────────────────────────────────────────────
  name: Joi.string().min(3).max(255).required().messages({
    'string.min': 'Nama minimal 3 karakter',
    'string.max': 'Nama maksimal 255 karakter',
    'any.required': 'Nama wajib diisi',
  }),

  email: Joi.string().email().required().messages({
    'string.email': 'Format email tidak valid',
    'any.required': 'Email wajib diisi',
  }),

  password: Joi.string().min(8).required().messages({
    'string.min': 'Password minimal 8 karakter',
    'any.required': 'Password wajib diisi',
  }),

  role: Joi.string().valid('user', 'hrd').default('user').messages({
    'any.only': "Role harus 'user' atau 'hrd'",
  }),

  // ── Field kondisional: wajib hanya jika role === 'hrd' ────────────────────
  //
  // Joi.when('role', { is: 'hrd', then: ..., otherwise: ... })
  //
  // Skenario A — role dikirim sebagai 'hrd':
  //   companyName → required, min 2 karakter
  //
  // Skenario B — role 'user' atau tidak dikirim (default 'user'):
  //   companyName → optional, boleh string kosong atau tidak ada sama sekali
  //   Jika dikirim tetap diterima (diabaikan oleh repository)
  //
  companyName: Joi.when('role', {
    is: 'hrd',
    then: Joi.string().min(2).max(255).required().messages({
      'string.min': 'Nama perusahaan minimal 2 karakter',
      'string.max': 'Nama perusahaan maksimal 255 karakter',
      'any.required': "companyName wajib diisi ketika role adalah 'hrd'",
    }),
    otherwise: Joi.string().max(255).optional().allow('', null),
  }),

  // ── Field HRD opsional lainnya ─────────────────────────────────────────────
  //
  // position dan companyWebsite tidak wajib meskipun role hrd,
  // tetapi jika dikirim harus valid formatnya.
  //
  position: Joi.string().max(100).optional().allow('', null).messages({
    'string.max': 'Jabatan maksimal 100 karakter',
  }),

  companyWebsite: Joi.string().uri().optional().allow('', null).messages({
    'string.uri': 'companyWebsite harus berupa URL valid (contoh: https://company.com)',
  }),

}).options({ abortEarly: false }); // Kumpulkan semua error sekaligus

