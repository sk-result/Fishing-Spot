import Joi from "joi";

const validasiSchema = Joi.object({
  fishing_spot_id: Joi.number().integer().positive().required().messages({
    "number.base": "fishing_spot_id harus berupa angka",
    "number.integer": "fishing_spot_id harus berupa bilangan bulat",
    "number.positive": "fishing_spot_id harus lebih besar dari 0",
    "any.required": "fishing_spot_id wajib diisi",
  }),

  duration_minutes: Joi.number()
    .integer()
    .min(30)
    .max(480)
    .default(60)
    .messages({
      "number.base": "duration_minutes harus berupa angka",
      "number.integer": "duration_minutes harus bilangan bulat",
      "number.min": "duration_minutes minimal 30 menit",
      "number.max": "duration_minutes maksimal 480 menit",
    }),

  // Fields that must not be sent by user (auto-generated)
  ticket_code: Joi.forbidden(),
  valid_date: Joi.forbidden(),
  status: Joi.forbidden(),
  status_pembayaran: Joi.forbidden(),
  user_id: Joi.forbidden(),
  created_at: Joi.forbidden(),
  updated_at: Joi.forbidden(),
});

export default validasiSchema;
