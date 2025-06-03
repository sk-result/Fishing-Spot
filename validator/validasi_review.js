import Joi from 'joi';

export const reviewSchema = Joi.object({
  fishing_spot_id: Joi.number().integer().required().messages({
    'number.base': `"fishing_spot_id" harus berupa angka`,
    'any.required': `"fishing_spot_id" wajib diisi`
  }),
  user_id: Joi.number().integer().required().messages({
    'number.base': `"user_id" harus berupa angka`,
    'any.required': `"user_id" wajib diisi`
  }),
  rating: Joi.number().integer().min(1).max(5).required().messages({
    'number.base': `"rating" harus berupa angka`,
    'number.min': `"rating" minimal 1`,
    'number.max': `"rating" maksimal 5`,
    'any.required': `"rating" wajib diisi`
  }),
  comment: Joi.string().min(5).max(500).required().messages({
    'string.base': `"comment" harus berupa teks`,
    'string.min': `"comment" minimal 5 karakter`,
    'string.max': `"comment" maksimal 500 karakter`,
    'any.required': `"comment" wajib diisi`
  }),
});
