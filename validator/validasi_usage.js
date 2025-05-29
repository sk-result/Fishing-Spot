import Joi from "joi";

// Skema validasi untuk create dan update
export const TicketUsageSchema = Joi.object({
  user_id: Joi.number().integer().required().messages({
    "number.base": "user_id harus berupa angka",
    "any.required": "user_id wajib diisi",
  }),
  ticket_id: Joi.number().integer().required().messages({
    "number.base": "ticket_id harus berupa angka",
    "any.required": "ticket_id wajib diisi",
  }),
  used_at: Joi.date().required().messages({
    "date.base": "used_at harus berupa tanggal yang valid",
    "any.required": "used_at wajib diisi",
  }),
  duration_used: Joi.number().integer().min(1).required().messages({
    "number.base": "duration_used harus berupa angka",
    "number.min": "duration_used minimal 1 jam",
    "any.required": "duration_used wajib diisi",
  }),
  spot_used_id: Joi.number().integer().required().messages({
    "number.base": "spot_used_id harus berupa angka",
    "any.required": "spot_used_id wajib diisi",
  }),
});
