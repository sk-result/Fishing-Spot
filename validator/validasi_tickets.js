import Joi from "joi";

// Schema validasi
const validasiSchema = Joi.object({
  ticket_code: Joi.string().max(10).required().messages({
    "string.base": `"ticket_code" harus berupa string`,
    "string.empty": `"ticket_code" tidak boleh kosong`,
    "string.max": `"ticket_code" maksimal 10 karakter`,
    "any.required": `"ticket_code" wajib diisi`,
  }),

  fishing_spot_id: Joi.number().integer().positive().required().messages({
    "number.base": `"fishing_spot_id" harus berupa angka`,
    "number.integer": `"fishing_spot_id" harus berupa bilangan bulat`,
    "number.positive": `"fishing_spot_id" harus lebih besar dari 0`,
    "any.required": `"fishing_spot_id" wajib diisi`,
  }),

  valid_date: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .messages({
      "string.pattern.base": `"valid_date" harus dalam format YYYY-MM-DD`,
      "string.empty": `"valid_date" wajib diisi`,
      "any.required": `"valid_date" wajib diisi`,
    }),

  status: Joi.string().valid("unused", "used", "expired").required().messages({
    "any.only": `"status" harus salah satu dari [unused, used, expired]`,
    "any.required": `"status" wajib diisi`,
  }),

  duration_minutes: Joi.number().integer().positive().required().messages({
    "number.base": `"duration_minutes" harus berupa angka`,
    "number.integer": `"duration_minutes" harus bilangan bulat`,
    "number.positive": `"duration_minutes" harus lebih besar dari 0`,
    "any.required": `"duration_minutes" wajib diisi`,
  }),
});

export default validasiSchema;
