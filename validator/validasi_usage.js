import Joi from "joi";

// Skema validasi untuk create dan update
export const TicketUsageSchema = Joi.object({
  ticket_id: Joi.number().integer().required().messages({
    "number.base": "ticket_id harus berupa angka",
    "any.required": "ticket_id wajib diisi",
  }),
  used_at: Joi.string().required().messages({
    "string.base": "used_at harus berupa tanggal yang valid",
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


export default TicketUsageSchema;